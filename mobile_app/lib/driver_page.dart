import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/consts.dart';
import 'package:mobile_app/signin_page.dart';
import 'package:mobile_app/auth_service.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  final Completer<GoogleMapController> _mapController =
      Completer<GoogleMapController>();
  final AuthService _authService = AuthService();

  LatLng? _currentPosition;
  LatLng? _startPoint;
  LatLng? _endPoint;

  String? _selectedStart;
  String? _selectedDestination;

  Map<PolylineId, Polyline> polylines = {};
  IO.Socket? socket;

  @override
  void initState() {
    super.initState();
    _initSocket();
    _determinePosition(); // start geolocator
    _generateMesh();
  }

  // ---- SOCKET ----
  void _initSocket() {
    socket = IO.io(
      'http://10.0.2.2:5000',
      IO.OptionBuilder().setTransports(['websocket']).enableAutoConnect().build(),
    );
    socket!.onConnect((_) => debugPrint('✅ Socket connected'));
    socket!.onDisconnect((_) => debugPrint('⚠️ Socket disconnected'));
  }

  void sendLocationUpdate(LatLng location) {
    if (socket != null && socket!.connected) {
      socket!.emit('driverLocation', {
        'lat': location.latitude,
        'lng': location.longitude,
        'driverId': 'driver123',
      });
    }
  }

  Future<void> _logout() async {
    await _authService.logout();
    socket?.disconnect();
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const SignIn()),
        (route) => false,
      );
    }
  }

  @override
  void dispose() {
    socket?.disconnect();
    super.dispose();
  }

  // ---- UI ----
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Driver Dashboard"),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: _currentPosition == null
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedStart,
                          decoration: const InputDecoration(
                            labelText: "Start",
                            border: OutlineInputBorder(),
                          ),
                          items: DUMMY_LOCATIONS.keys
                              .map((loc) =>
                                  DropdownMenuItem(value: loc, child: Text(loc)))
                              .toList(),
                          onChanged: (value) {
                            setState(() {
                              _selectedStart = value;
                              _startPoint = DUMMY_LOCATIONS[value]!;
                            });
                            _updateRoute();
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedDestination,
                          decoration: const InputDecoration(
                            labelText: "Destination",
                            border: OutlineInputBorder(),
                          ),
                          items: DUMMY_LOCATIONS.keys
                              .map((loc) =>
                                  DropdownMenuItem(value: loc, child: Text(loc)))
                              .toList(),
                          onChanged: (value) {
                            setState(() {
                              _selectedDestination = value;
                              _endPoint = DUMMY_LOCATIONS[value]!;
                            });
                            _updateRoute();
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: GoogleMap(
                    onMapCreated: (controller) {
                      _mapController.complete(controller);
                      _cameraToPosition(_currentPosition!);
                    },
                    initialCameraPosition: CameraPosition(
                      target: _currentPosition!,
                      zoom: 16,
                    ),
                    myLocationEnabled: true,
                    myLocationButtonEnabled: true,
                    markers: {
                      Marker(
                        markerId: const MarkerId("_currentLocation"),
                        icon: BitmapDescriptor.defaultMarkerWithHue(
                          BitmapDescriptor.hueBlue,
                        ),
                        position: _currentPosition!,
                      ),
                      if (_startPoint != null)
                        Marker(
                          markerId: const MarkerId("_start"),
                          icon: BitmapDescriptor.defaultMarkerWithHue(
                            BitmapDescriptor.hueGreen,
                          ),
                          position: _startPoint!,
                        ),
                      if (_endPoint != null)
                        Marker(
                          markerId: const MarkerId("_end"),
                          icon: BitmapDescriptor.defaultMarkerWithHue(
                            BitmapDescriptor.hueRed,
                          ),
                          position: _endPoint!,
                        ),
                    },
                    polylines: Set<Polyline>.of(polylines.values),
                  ),
                ),
              ],
            ),
    );
  }

  Future<void> _cameraToPosition(LatLng pos) async {
    if (!_mapController.isCompleted) return;
    final controller = await _mapController.future;
    controller.animateCamera(
      CameraUpdate.newCameraPosition(CameraPosition(target: pos, zoom: 16)),
    );
  }

  // ---- GEOLOCATOR ----
  Future<void> _determinePosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    if (permission == LocationPermission.deniedForever) return;

    // ✅ Use LocationSettings instead of deprecated desiredAccuracy
    Position position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
      ),
    );

    setState(() {
      _currentPosition = LatLng(position.latitude, position.longitude);
    });

    // Listen for continuous updates
    Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 5,
      ),
    ).listen((Position pos) {
      final newPos = LatLng(pos.latitude, pos.longitude);
      setState(() => _currentPosition = newPos);
      sendLocationUpdate(newPos);
      _cameraToPosition(newPos);
    });
  }

  // ---- ROUTE with OSRM ----
  Future<void> _updateRoute() async {
    if (_startPoint == null || _endPoint == null) return;

    final start = '${_startPoint!.longitude},${_startPoint!.latitude}';
    final end = '${_endPoint!.longitude},${_endPoint!.latitude}';
    final url =
        'https://router.project-osrm.org/route/v1/driving/$start;$end?overview=full&geometries=geojson';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final coords = data['routes'][0]['geometry']['coordinates'] as List;

        final List<LatLng> polyPoints = coords
            .map((c) => LatLng(c[1] as double, c[0] as double))
            .toList();

        _generateRoutePolyline(polyPoints);
        _cameraToPosition(_startPoint!);
      } else {
        debugPrint('OSRM request failed: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error fetching OSRM route: $e');
    }
  }

  void _generateRoutePolyline(List<LatLng> polylineCoordinates) {
    final id = const PolylineId("route");
    final polyline = Polyline(
      polylineId: id,
      color: Colors.blue,
      points: polylineCoordinates,
      width: 6,
    );
    setState(() {
      polylines[id] = polyline;
    });
  }

  // ---- Mesh decoration ----
  void _generateMesh() {
    List<Polyline> meshPolylines = [];
    double startLat = 23.0;
    double endLat = 24.0;
    double startLng = 77.0;
    double endLng = 78.0;

    for (double lng = startLng; lng <= endLng; lng += 0.05) {
      meshPolylines.add(
        Polyline(
          polylineId: PolylineId("v_$lng"),
          color: Colors.yellow.withOpacity(0.6),
          width: 1,
          points: [LatLng(startLat, lng), LatLng(endLat, lng)],
        ),
      );
    }

    for (double lat = startLat; lat <= endLat; lat += 0.05) {
      meshPolylines.add(
        Polyline(
          polylineId: PolylineId("h_$lat"),
          color: Colors.yellow.withOpacity(0.6),
          width: 1,
          points: [LatLng(lat, startLng), LatLng(lat, endLng)],
        ),
      );
    }

    for (var poly in meshPolylines) {
      polylines[poly.polylineId] = poly;
    }
    setState(() {});
  }
}

import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:location/location.dart';
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
  final Location _locationController = Location();
  final Completer<GoogleMapController> _mapController =
      Completer<GoogleMapController>();
  final AuthService _authService = AuthService();

  LatLng? _currentP;
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
    getLocationUpdates();
    _generateMesh();
  }

  void _initSocket() {
    socket = IO.io(
      'http://10.0.2.2:5000', // Change to your backend URL
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
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const SignIn()),
      (route) => false,
    );
  }

  @override
  void dispose() {
    socket?.disconnect();
    super.dispose();
  }

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
            tooltip: "Logout",
          ),
        ],
      ),
      body: Column(
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
            child: _currentP == null
                ? const Center(child: Text("Loading Map..."))
                : GoogleMap(
                    onMapCreated: (GoogleMapController controller) =>
                        _mapController.complete(controller),
                    initialCameraPosition: CameraPosition(
                      target: _currentP!,
                      zoom: 13,
                    ),
                    markers: {
                      if (_currentP != null)
                        Marker(
                          markerId: const MarkerId("_currentLocation"),
                          icon: BitmapDescriptor.defaultMarkerWithHue(
                            BitmapDescriptor.hueBlue,
                          ),
                          position: _currentP!,
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
    final GoogleMapController controller = await _mapController.future;
    await controller.animateCamera(
      CameraUpdate.newCameraPosition(CameraPosition(target: pos, zoom: 15)),
    );
  }

  Future<void> getLocationUpdates() async {
    bool serviceEnabled = await _locationController.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await _locationController.requestService();
      if (!serviceEnabled) return;
    }

    PermissionStatus permissionGranted = await _locationController.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await _locationController.requestPermission();
      if (permissionGranted != PermissionStatus.granted) return;
    }

    _locationController.onLocationChanged.listen((currentLocation) {
      if (currentLocation.latitude != null &&
          currentLocation.longitude != null) {
        final newPos =
            LatLng(currentLocation.latitude!, currentLocation.longitude!);
        setState(() => _currentP = newPos);
        sendLocationUpdate(newPos);
      }
    });
  }

  /// Fetch a route polyline using OSRM (OpenStreetMap)
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

  /// Yellow mesh for background decoration
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

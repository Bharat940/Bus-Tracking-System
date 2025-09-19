import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:mobile_app/consts.dart';
import 'package:location/location.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  final Location _locationController = Location();
  final Completer<GoogleMapController> _mapController =
      Completer<GoogleMapController>();

  LatLng? _currentP;
  LatLng? _startPoint;
  LatLng? _endPoint;

  String? _selectedStart;
  String? _selectedDestination;

  Map<PolylineId, Polyline> polylines = {};

  @override
  void initState() {
    super.initState();
    getLocationUpdates();
    _generateMesh(); // generate yellow mesh when map loads
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Bus Route Tracker")),
      body: Column(
        children: [
          // Dropdowns for start & destination
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

          // Map view
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
                              BitmapDescriptor.hueBlue),
                          position: _currentP!,
                        ),
                      if (_startPoint != null)
                        Marker(
                          markerId: const MarkerId("_start"),
                          icon: BitmapDescriptor.defaultMarkerWithHue(
                              BitmapDescriptor.hueGreen),
                          position: _startPoint!,
                        ),
                      if (_endPoint != null)
                        Marker(
                          markerId: const MarkerId("_end"),
                          icon: BitmapDescriptor.defaultMarkerWithHue(
                              BitmapDescriptor.hueRed),
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
    CameraPosition newCameraPosition = CameraPosition(target: pos, zoom: 15);
    await controller.animateCamera(
      CameraUpdate.newCameraPosition(newCameraPosition),
    );
  }

  Future<void> getLocationUpdates() async {
    bool serviceEnabled;
    PermissionStatus permissionGranted;

    serviceEnabled = await _locationController.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await _locationController.requestService();
      if (!serviceEnabled) return;
    }

    permissionGranted = await _locationController.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await _locationController.requestPermission();
      if (permissionGranted != PermissionStatus.granted) return;
    }

    _locationController.onLocationChanged
        .listen((LocationData currentLocation) {
      if (currentLocation.latitude != null &&
          currentLocation.longitude != null) {
        setState(() {
          _currentP =
              LatLng(currentLocation.latitude!, currentLocation.longitude!);
        });
      }
    });
  }

  Future<void> _updateRoute() async {
    if (_startPoint == null || _endPoint == null) return;

    List<LatLng> polylineCoordinates = [];

    PolylinePoints polylinePoints = PolylinePoints(apiKey: GOOGLE_MAPS_API_KEY);

    PolylineRequest request = PolylineRequest(
      origin: PointLatLng(_startPoint!.latitude, _startPoint!.longitude),
      destination: PointLatLng(_endPoint!.latitude, _endPoint!.longitude),
      mode: TravelMode.driving,
    );

    PolylineResult result =
        await polylinePoints.getRouteBetweenCoordinates(request: request);

    if (result.points.isNotEmpty) {
      polylineCoordinates = result.points
          .map((point) => LatLng(point.latitude, point.longitude))
          .toList();
    } else {
      debugPrint("Error fetching polyline: ${result.errorMessage}");
    }

    _generateRoutePolyline(polylineCoordinates);
    _cameraToPosition(_startPoint!);
  }

  void _generateRoutePolyline(List<LatLng> polylineCoordinates) {
    PolylineId id = const PolylineId("route");
    Polyline polyline = Polyline(
      polylineId: id,
      color: Colors.blue, // Route is BLUE
      points: polylineCoordinates,
      width: 6,
    );
    setState(() {
      polylines[id] = polyline;
    });
  }

  void _generateMesh() {
    // Generate a simple yellow mesh around the map area
    List<Polyline> meshPolylines = [];
    double startLat = 23.0; // adjust to your region
    double endLat = 24.0;
    double startLng = 77.0;
    double endLng = 78.0;

    // Vertical lines
    for (double lng = startLng; lng <= endLng; lng += 0.05) {
      meshPolylines.add(Polyline(
        polylineId: PolylineId("v_$lng"),
        color: Colors.yellow.withOpacity(0.6),
        width: 1,
        points: [LatLng(startLat, lng), LatLng(endLat, lng)],
      ));
    }

    // Horizontal lines
    for (double lat = startLat; lat <= endLat; lat += 0.05) {
      meshPolylines.add(Polyline(
        polylineId: PolylineId("h_$lat"),
        color: Colors.yellow.withOpacity(0.6),
        width: 1,
        points: [LatLng(lat, startLng), LatLng(lat, endLng)],
      ));
    }

    for (var poly in meshPolylines) {
      polylines[poly.polylineId] = poly;
    }
    setState(() {});
  }
}




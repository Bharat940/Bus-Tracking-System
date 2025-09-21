import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:mobile_app/auth_service.dart';
import 'package:mobile_app/signin_page.dart';

class CommuterPage extends StatefulWidget {
  const CommuterPage({super.key});

  @override
  State<CommuterPage> createState() => _CommuterPageState();
}

class _CommuterPageState extends State<CommuterPage> {
  final Completer<GoogleMapController> _mapController = Completer();
  final Location _locationController = Location();
  final AuthService _authService = AuthService();

  LatLng? _currentPosition;

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _logout() async {
    await _authService.logout();
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const SignIn()),
      (route) => false,
    );
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    PermissionStatus permissionGranted;

    // Check if location service is enabled
    serviceEnabled = await _locationController.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await _locationController.requestService();
      if (!serviceEnabled) return;
    }

    // Check permission
    permissionGranted = await _locationController.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await _locationController.requestPermission();
      if (permissionGranted != PermissionStatus.granted) return;
    }

    // Listen to location changes
    _locationController.onLocationChanged.listen((locationData) {
      if (locationData.latitude != null && locationData.longitude != null) {
        setState(() {
          _currentPosition =
              LatLng(locationData.latitude!, locationData.longitude!);
        });
        _moveCamera(_currentPosition!);
      }
    });
  }

  Future<void> _moveCamera(LatLng position) async {
    final GoogleMapController controller = await _mapController.future;
    controller.animateCamera(CameraUpdate.newCameraPosition(
      CameraPosition(target: position, zoom: 15),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Commuter Dashboard"),
        automaticallyImplyLeading: false, // removes default back button
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: "Logout",
            onPressed: _logout,
          ),
        ],
      ),
      body: _currentPosition == null
          ? const Center(child: CircularProgressIndicator())
          : GoogleMap(
              onMapCreated: (controller) => _mapController.complete(controller),
              initialCameraPosition: CameraPosition(
                target: _currentPosition!,
                zoom: 15,
              ),
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
              markers: {
                Marker(
                  markerId: const MarkerId("current"),
                  position: _currentPosition!,
                  infoWindow: const InfoWindow(title: "You are here"),
                  icon: BitmapDescriptor.defaultMarkerWithHue(
                    BitmapDescriptor.hueBlue,
                  ),
                ),
              },
            ),
    );
  }
}

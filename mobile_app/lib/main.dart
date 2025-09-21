import 'package:flutter/material.dart';
import 'package:mobile_app/driver_page.dart';
import 'package:mobile_app/signup_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
     theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: Color(0xFF17046B),
      ),

      
     home: Signup(),
    //  home: MapPage(),
    );
  }
}


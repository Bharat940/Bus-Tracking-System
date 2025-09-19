import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String baseUrl = "http://10.0.2.2:5000/api/auth";

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("token", data["data"]["token"]);
      await prefs.setString("role", data["data"]["user"]["role"]);
      return data["data"];
    } else {
      throw Exception("Login failed: ${res.body}");
    }
  }

  Future<Map<String, dynamic>> signup({
    required String name,
    required String phone,
    required String email,
    required String password,
    required String role,
  }) async {
    final res = await http.post(
      Uri.parse("$baseUrl/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "name": name,
        "phone": phone,
        "email": email,
        "password": password,
        "role": role,
      }),
    );

    if (res.statusCode == 201) {
      final data = jsonDecode(res.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("token", data["data"]["token"]);
      await prefs.setString("role", data["data"]["user"]["role"]);
      return data["data"];
    } else {
      throw Exception("Signup failed: ${res.body}");
    }
  }

  Future<Map<String, dynamic>?> getProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token == null) return null;

    final res = await http.get(
      Uri.parse("$baseUrl/profile"),
      headers: {"Authorization": "Bearer $token"},
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body)["data"];
    } else {
      return null;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}


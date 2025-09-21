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

    final data = jsonDecode(res.body);

    if (res.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      if (data["data"]?["token"] != null) {
        await prefs.setString("token", data["data"]["token"]);
      }
      if (data["data"]?["user"]?["role"] != null) {
        await prefs.setString("role", data["data"]["user"]["role"]);
      }
      return data;
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

    final data = jsonDecode(res.body);

    if (res.statusCode == 201 || res.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();

      // Save token if available
      if (data["data"]?["token"] != null) {
        await prefs.setString("token", data["data"]["token"]);
      }

      // Save role if available, else fallback
      if (data["data"]?["user"]?["role"] != null) {
        await prefs.setString("role", data["data"]["user"]["role"]);
      } else {
        await prefs.setString("role", role);
      }

      return data;
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

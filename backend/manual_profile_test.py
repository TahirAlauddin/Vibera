"""
Quick test script for UserProfile endpoints.
Run this script to test all UserProfile functionality.

Usage:
    python test_user_profile.py
"""

import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"


# Colors for terminal output
class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"


def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.RESET}")


def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.RESET}")


def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.RESET}")


def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.RESET}")


def get_access_token(username, password):
    """Get JWT access token using Djoser login"""
    print_info("Getting access token...")

    url = f"{API_BASE}/auth/jwt/create/"
    data = {"username": username, "password": password}

    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            token_data = response.json()
            print_success("Access token obtained")
            return token_data.get("access")
        else:
            print_error(f"Failed to get token: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Error getting token: {str(e)}")
        return None


def verify_profile_structure(data, profile_type="profile"):
    """Verify that profile data has expected structure"""
    required_fields = ["user", "avatar"]
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        print_warning(f"Missing fields in {profile_type}: {', '.join(missing_fields)}")
        return False

    # Verify user is an integer (user ID)
    if not isinstance(data.get("user"), int):
        print_warning(f"User field should be an integer, got {type(data.get('user'))}")
        return False

    print_success(f"Profile structure verified for {profile_type}")
    return True


def test_get_own_profile(token):
    """Test GET /api/users/profile/"""
    print("\n" + "=" * 50)
    print_info("Test 1: GET Own Profile")
    print("=" * 50)

    url = f"{API_BASE}/users/profile/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print_success("Profile retrieved successfully")
            print(f"Profile Data: {json.dumps(data, indent=2)}")

            # Verify structure
            if verify_profile_structure(data, "own profile"):
                return {"status": "passed", "data": data}
            else:
                return {"status": "failed", "reason": "Invalid profile structure"}

        elif response.status_code == 404:
            print_warning("Profile does not exist yet")
            print(f"Response: {response.json()}")
            return {"status": "skipped", "reason": "Profile not created"}
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            return {
                "status": "failed",
                "reason": f"Unexpected status {response.status_code}",
            }

    except Exception as e:
        print_error(f"Error during test: {str(e)}")
        return {"status": "error", "reason": str(e)}


def test_get_other_profile(token, user_id):
    """Test GET /api/users/profile/<user_id>/"""
    print("\n" + "=" * 50)
    print_info(f"Test 2: GET Other User's Profile (ID: {user_id})")
    print("=" * 50)

    url = f"{API_BASE}/users/profile/{user_id}/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print_success(f"Profile for user {user_id} retrieved successfully")
            print(f"Profile Data: {json.dumps(data, indent=2)}")

            # Verify structure and that it's the correct user
            if verify_profile_structure(data, f"user {user_id}'s profile"):
                if data.get("user") == user_id:
                    print_success(f"Confirmed profile belongs to user {user_id}")
                    return {"status": "passed", "data": data}
                else:
                    print_error(
                        f"Profile user ID mismatch: expected {user_id}, got {data.get('user')}"
                    )
                    return {"status": "failed", "reason": "User ID mismatch"}
            else:
                return {"status": "failed", "reason": "Invalid profile structure"}

        elif response.status_code == 404:
            print_warning(f"Profile for user {user_id} does not exist")
            print(f"Response: {response.json()}")
            return {
                "status": "skipped",
                "reason": f"Profile for user {user_id} not found",
            }
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            return {
                "status": "failed",
                "reason": f"Unexpected status {response.status_code}",
            }

    except Exception as e:
        print_error(f"Error during test: {str(e)}")
        return {"status": "error", "reason": str(e)}


def test_update_profile(token, avatar_path=None):
    """Test PATCH /api/users/profile/"""
    print("\n" + "=" * 50)
    print_info("Test 3: PATCH Update Own Profile")
    print("=" * 50)

    url = f"{API_BASE}/users/profile/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    data = {}
    if avatar_path:
        data["avatar"] = avatar_path
    else:
        data["avatar"] = "test/avatar/path.jpg"

    try:
        response = requests.patch(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            updated_data = response.json()
            print_success("Profile updated successfully")
            print(f"Updated Profile: {json.dumps(updated_data, indent=2)}")

            # Verify the structure
            if not verify_profile_structure(updated_data, "updated profile"):
                return {
                    "status": "failed",
                    "reason": "Invalid updated profile structure",
                }

            # Verify the avatar was updated
            if updated_data.get("avatar") == data["avatar"]:
                print_success("Avatar field updated correctly")
                return {"status": "passed", "data": updated_data}
            else:
                print_warning(f"Avatar may not have updated as expected")
                print_warning(
                    f"Sent: {data['avatar']}, Received: {updated_data.get('avatar')}"
                )
                return {
                    "status": "passed",
                    "data": updated_data,
                    "warning": "Avatar value mismatch",
                }

        elif response.status_code == 404:
            print_error("Profile does not exist - cannot update non-existent profile")
            print(f"Response: {response.json()}")
            return {"status": "failed", "reason": "Profile not found (create it first)"}

        elif response.status_code == 400:
            print_error("Bad request - validation error")
            print(f"Response: {response.json()}")
            return {"status": "failed", "reason": "Validation error"}
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            return {
                "status": "failed",
                "reason": f"Unexpected status {response.status_code}",
            }

    except Exception as e:
        print_error(f"Error during test: {str(e)}")
        return {"status": "error", "reason": str(e)}


def test_unauthorized_access():
    """Test accessing profile without token"""
    print("\n" + "=" * 50)
    print_info("Test 4: Unauthorized Access (No Token)")
    print("=" * 50)

    url = f"{API_BASE}/users/profile/"

    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 401:
            print_success("Correctly rejected unauthorized access")
            print(f"Response: {response.json()}")
            return {"status": "passed"}
        else:
            print_error(f"Expected 401, got {response.status_code}")
            print(f"Response: {response.text}")
            return {
                "status": "failed",
                "reason": f"Expected 401, got {response.status_code}",
            }

    except Exception as e:
        print_error(f"Error during test: {str(e)}")
        return {"status": "error", "reason": str(e)}


def show_test_menu():
    """Display available test options"""
    print("\n" + "=" * 50)
    print("Available Tests:")
    print("=" * 50)
    print("1. Get Own Profile (GET /api/users/profile/)")
    print("2. Get Other User's Profile (GET /api/users/profile/<user_id>/)")
    print("3. Update Own Profile (PATCH /api/users/profile/)")
    print("4. Test Unauthorized Access (GET without token)")
    print("5. Run All Tests")
    print("0. Exit")
    print("=" * 50)


def run_test_choice(choice, token):
    """Run a test based on user choice"""
    if choice == "1":
        return ("Get Own Profile", test_get_own_profile(token))
    elif choice == "2":
        user_id = input("Enter user ID to test: ").strip()
        if not user_id:
            print_warning("No user ID provided, skipping test")
            return None
        try:
            user_id = int(user_id)
            if user_id < 0:
                print_warning("User ID cannot be negative, skipping test")
                return None
            return ("Get Other User's Profile", test_get_other_profile(token, user_id))
        except ValueError:
            print_error("Invalid user ID format")
            return None
    elif choice == "3":
        avatar_path = input("Enter avatar path (or press Enter for default): ").strip()
        return (
            "Update Own Profile",
            test_update_profile(token, avatar_path if avatar_path else None),
        )
    elif choice == "4":
        return ("Unauthorized Access", test_unauthorized_access())
    elif choice == "5":
        # Run all tests
        results = []
        results.append(("Get Own Profile", test_get_own_profile(token)))

        other_user_id = input(
            "\nEnter another user ID to test (or press Enter to skip): "
        ).strip()
        if other_user_id:
            try:
                user_id = int(other_user_id)
                if user_id >= 0:
                    results.append(
                        (
                            "Get Other User's Profile",
                            test_get_other_profile(token, user_id),
                        )
                    )
            except ValueError:
                print_warning("Invalid user ID format, skipping test")

        results.append(("Update Own Profile", test_update_profile(token)))
        results.append(("Unauthorized Access", test_unauthorized_access()))

        return results
    else:
        print_error("Invalid choice")
        return None


def print_test_result(test_name, result):
    """Print the result of a single test"""
    if result is None:
        return

    status = result.get("status", "unknown")

    if status == "passed":
        print_success(f"{test_name}: PASSED")
    elif status == "failed":
        reason = result.get("reason", "Unknown")
        print_error(f"{test_name}: FAILED - {reason}")
    elif status == "skipped":
        reason = result.get("reason", "Unknown")
        print_warning(f"{test_name}: SKIPPED - {reason}")
    elif status == "error":
        reason = result.get("reason", "Unknown")
        print_error(f"{test_name}: ERROR - {reason}")
    else:
        print_warning(f"{test_name}: UNKNOWN STATUS")


def main():
    print("\n" + "=" * 50)
    print("UserProfile API Testing Script")
    print("=" * 50)

    # Get credentials
    print("\nPlease provide your credentials:")
    username = input("Username: ").strip()
    password = input("Password: ").strip()

    if not username or not password:
        print_error("Username and password are required")
        sys.exit(1)

    # Get access token
    token = get_access_token(username, password)
    if not token:
        print_error("Failed to authenticate. Exiting.")
        sys.exit(1)

    print(f"\nToken: {token[:50]}...")

    # Track all test results
    all_results = []

    # Main testing loop
    while True:
        show_test_menu()
        choice = input("\nSelect a test (0-5): ").strip()

        if choice == "0":
            print_info("Exiting test script...")
            break

        if choice not in ["1", "2", "3", "4", "5"]:
            print_error("Invalid choice. Please select 0-5.")
            continue

        # Run the selected test(s)
        result = run_test_choice(choice, token)

        if choice == "5":
            # Handle "Run All Tests" - result is a list
            if isinstance(result, list):
                for test_name, test_result in result:
                    print_test_result(test_name, test_result)
                    all_results.append((test_name, test_result))

                # Ask if they want to continue after all tests
                print("\n" + "-" * 50)
                response = (
                    input("All tests completed. Run another test? (y/n): ")
                    .strip()
                    .lower()
                )
                if response not in ["y", "yes"]:
                    break
        else:
            # Handle single test
            if result:
                test_name, test_result = result
                print_test_result(test_name, test_result)
                all_results.append((test_name, test_result))

                # Ask if they want to run another test
                status = test_result.get("status", "unknown")
                if status in ["failed", "error"]:
                    print("\n" + "-" * 50)
                    response = (
                        input("Test failed. Run another test? (y/n): ").strip().lower()
                    )
                    if response not in ["y", "yes"]:
                        break
                elif status == "passed":
                    print("\n" + "-" * 50)
                    response = (
                        input("Test passed. Run another test? (y/n): ").strip().lower()
                    )
                    if response not in ["y", "yes"]:
                        break
                # For skipped tests, just continue to menu
            else:
                print_warning("Test was skipped or invalid")
                # Continue to menu for invalid/skipped tests

    # Final summary
    if all_results:
        print("\n" + "=" * 50)
        print("Final Test Summary")
        print("=" * 50)

        passed = sum(1 for _, r in all_results if r and r.get("status") == "passed")
        failed = sum(1 for _, r in all_results if r and r.get("status") == "failed")
        skipped = sum(1 for _, r in all_results if r and r.get("status") == "skipped")
        errors = sum(1 for _, r in all_results if r and r.get("status") == "error")
        total = len(all_results)

        for test_name, result in all_results:
            print_test_result(test_name, result)

        print(
            f"\nTotal: {passed} passed, {failed} failed, {skipped} skipped, {errors} errors out of {total} tests"
        )

        if failed == 0 and errors == 0:
            if skipped > 0:
                print_warning(
                    f"All executable tests passed! ({skipped} test(s) skipped)"
                )
            else:
                print_success("All tests passed!")
            return 0
        else:
            print_error("Some tests failed or encountered errors.")
            return 1

    return 0


if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        import traceback

        traceback.print_exc()
        sys.exit(1)

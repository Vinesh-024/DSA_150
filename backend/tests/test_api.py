import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data

def test_run_code_empty_fails():
    response = client.post("/api/v1/submissions/run", json={
        "problemId": "p-001",
        "language": "python",
        "code": "   "
    })
    assert response.status_code == 400

def test_run_code_starter_stub_fails_verdict():
    response = client.post("/api/v1/submissions/run", json={
        "problemId": "p-001",
        "language": "python",
        "code": "class Solution:\n    def twoSum(self, nums, target):\n        pass"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "Wrong Answer"
    assert data["status"] == "COMPLETED"

def test_run_code_valid_passes():
    response = client.post("/api/v1/submissions/run", json={
        "problemId": "p-001",
        "language": "python",
        "code": "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i\n        return []"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "Accepted"
    assert data["passedCases"] > 0

def test_submit_code_empty_fails():
    response = client.post("/api/v1/submissions/submit", json={
        "problemId": "p-001",
        "language": "python",
        "code": ""
    })
    assert response.status_code == 400

def test_submit_code_valid_passes():
    response = client.post("/api/v1/submissions/submit", json={
        "problemId": "p-001",
        "language": "python",
        "code": "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i\n        return []"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "Accepted"
    assert data["totalCases"] == 5
    assert data["passedCases"] == 5

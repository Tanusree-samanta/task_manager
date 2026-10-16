def test_health_check(client):
    """Test that the /api/health endpoint returns a 200 and healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "DevOpsForge" in data["service"]
    assert data["database"] == "healthy"

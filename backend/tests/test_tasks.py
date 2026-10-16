import pytest
from app.models.task import Task


def test_list_empty_tasks(client):
    """Test GET /api/tasks returns empty list initially."""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    assert response.json() == []


def test_create_task(client):
    """Test POST /api/tasks creates task with full fields."""
    payload = {
        "title": "Configure Dockerfile multi-stage build",
        "description": "Optimize production footprint under 80MB",
        "priority": "high",
        "dueDate": "2026-10-24",
        "dueTime": "14:00",
        "category": "DevOps",
        "tags": ["Docker", "Linux"],
        "subtasks": [
            {"title": "Setup base image"},
            {"title": "Add non-root user", "completed": True},
        ],
    }
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Configure Dockerfile multi-stage build"
    assert data["priority"] == "high"
    assert data["dueDate"] == "2026-10-24"
    assert data["completed"] is False
    assert len(data["subtasks"]) == 2
    assert "id" in data
    assert "createdAt" in data


def test_reject_empty_title(client):
    """Test POST /api/tasks rejects empty or whitespace-only titles with 422."""
    # Empty string
    response1 = client.post("/api/tasks", json={"title": ""})
    assert response1.status_code == 422

    # Whitespace only
    response2 = client.post("/api/tasks", json={"title": "   "})
    assert response2.status_code == 422


def test_get_task_by_id(client):
    """Test GET /api/tasks/{task_id} retrieves a created task."""
    create_res = client.post(
        "/api/tasks",
        json={"title": "Unit test endpoint", "priority": "medium"},
    )
    task_id = create_res.json()["id"]

    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["id"] == task_id
    assert data["title"] == "Unit test endpoint"


def test_missing_task_id(client):
    """Test GET /api/tasks/{task_id} returns 404 for non-existent ID."""
    response = client.get("/api/tasks/non-existent-id-999")
    assert response.status_code == 404
    assert "was not found" in response.json()["detail"]


def test_update_task_completion(client):
    """Test PATCH /api/tasks/{task_id} toggling completed status."""
    create_res = client.post(
        "/api/tasks",
        json={"title": "Setup PostgreSQL migrations", "completed": False},
    )
    task_id = create_res.json()["id"]

    # Mark completed
    patch_res = client.patch(
        f"/api/tasks/{task_id}",
        json={"completed": True},
    )
    assert patch_res.status_code == 200
    updated_data = patch_res.json()
    assert updated_data["completed"] is True
    assert updated_data["completedAt"] is not None

    # Reopen
    reopen_res = client.patch(
        f"/api/tasks/{task_id}",
        json={"completed": False},
    )
    assert reopen_res.status_code == 200
    assert reopen_res.json()["completed"] is False
    assert reopen_res.json()["completedAt"] is None


def test_update_task_details(client):
    """Test PATCH /api/tasks/{task_id} updating title, priority, and description."""
    create_res = client.post(
        "/api/tasks",
        json={"title": "Initial Title", "priority": "low"},
    )
    task_id = create_res.json()["id"]

    patch_res = client.patch(
        f"/api/tasks/{task_id}",
        json={
            "title": "Updated Title",
            "priority": "high",
            "description": "Added detailed specification",
        },
    )
    assert patch_res.status_code == 200
    data = patch_res.json()
    assert data["title"] == "Updated Title"
    assert data["priority"] == "high"
    assert data["description"] == "Added detailed specification"


def test_delete_task(client):
    """Test DELETE /api/tasks/{task_id} removes task and subsequent GET returns 404."""
    create_res = client.post("/api/tasks", json={"title": "Task to delete"})
    task_id = create_res.json()["id"]

    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == 200

    # Verify not found
    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == 404


def test_database_persistence(client, db_session):
    """Test that task created via API is truly persisted in the database session."""
    payload = {
        "title": "Persistent Task",
        "description": "Direct DB persistence verification",
        "priority": "high",
    }
    res = client.post("/api/tasks", json=payload)
    task_id = res.json()["id"]

    # Query directly from DB session without HTTP
    db_task = db_session.query(Task).filter(Task.id == task_id).first()
    assert db_task is not None
    assert db_task.title == "Persistent Task"
    assert db_task.priority == "high"

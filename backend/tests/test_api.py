import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("database", data)

    def test_get_stories(self):
        response = self.client.get("/api/stories")
        self.assertEqual(response.status_code, 200)
        stories = response.json()
        self.assertIsInstance(stories, list)
        if len(stories) > 0:
            self.assertIn("id", stories[0])
            self.assertIn("title", stories[0])

    def test_get_story_not_found(self):
        response = self.client.get("/api/stories/invalid-story-id-does-not-exist")
        self.assertEqual(response.status_code, 404)
        self.assertIn("detail", response.json())

    def test_ai_qa_fallback(self):
        payload = {
            "storyId": "konark",
            "question": "is this scientifically verified",
            "lang": "en"
        }
        response = self.client.post("/api/ai/qa", json=payload)
        self.assertIn(response.status_code, [200, 404])
        if response.status_code == 200:
            data = response.json()
            self.assertIn("answer", data)
            self.assertTrue(len(data["answer"]) > 0)

    def test_ai_explain_fallback(self):
        payload = {
            "storyId": "konark",
            "mode": "eli10",
            "lang": "en"
        }
        response = self.client.post("/api/ai/explain", json=payload)
        self.assertIn(response.status_code, [200, 404])
        if response.status_code == 200:
            data = response.json()
            self.assertIn("text", data)
            self.assertTrue(len(data["text"]) > 0)

if __name__ == '__main__':
    unittest.main()

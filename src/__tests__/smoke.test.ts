import { aiService } from "../services/aiService";
import { adminService } from "../services/adminService";
import { getStoryDetail } from "../utils/storyEngine";

describe("VELORA Core Frontend Modules Smoke Test", () => {
  it("should successfully import frontend client services", () => {
    expect(aiService).toBeDefined();
    expect(adminService).toBeDefined();
    expect(typeof aiService.askAI).toBe("function");
  });

  it("should retrieve static story helper", () => {
    const story = getStoryDetail("bhangarh");
    expect(story).toBeDefined();
    expect(story.id).toBe("bhangarh");
  });
});

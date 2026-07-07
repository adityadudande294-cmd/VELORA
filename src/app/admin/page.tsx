"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Image as ImageIcon,
  Users as UsersIcon,
  BarChart2,
  Plus,
  Edit,
  Trash,
  Copy,
  Eye,
  Check,
  FileText,
  Lock,
  LogOut,
  RefreshCw,
  Upload,
  PlusCircle,
  FolderPlus,
  EyeOff
} from "lucide-react";
import { adminService, DashboardStats, AdminUser, Category, MediaAsset } from "@/services/adminService";
import { StoryDetail } from "@/types";

type TabType = "dashboard" | "stories" | "categories" | "media" | "users" | "analytics";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Auth state
  const [email, setEmail] = useState<string>("admin@velora.com");
  const [password, setPassword] = useState<string>("admin123");
  const [authError, setAuthError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Entities state
  const [stories, setStories] = useState<StoryDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Editing state placeholders
  const [editingStory, setEditingStory] = useState<Partial<StoryDetail> | null>(null);
  const [editorTab, setEditorTab] = useState<"general" | "narrative" | "timeline" | "explanations" | "preview">("general");
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);

  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("velora_admin_token");
      const user = localStorage.getItem("velora_admin_user");
      if (token && user) {
        setAuthorized(true);
        setCurrentUser(JSON.parse(user));
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      loadAllData();
    }
  }, [authorized]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const dashboardStats = await adminService.fetchDashboardStats();
      if (dashboardStats) setStats(dashboardStats);

      const storiesList = await adminService.fetchAdminStories();
      setStories(storiesList);

      const categoriesList = await adminService.fetchCategories();
      setCategories(categoriesList);

      const mediaList = await adminService.fetchMedia();
      setMedia(mediaList);

      const usersList = await adminService.fetchUsers();
      setUsers(usersList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      const res = await adminService.adminLogin(email, password);
      if (res) {
        setAuthorized(true);
        setCurrentUser(res.user);
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials combination");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("velora_admin_token");
      localStorage.removeItem("velora_admin_user");
    }
    setAuthorized(false);
    setCurrentUser(null);
  };

  // User Actions
  const handleToggleSuspend = async (userId: string) => {
    const ok = await adminService.toggleUserSuspend(userId);
    if (ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, suspended: !u.suspended } : u));
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const ok = await adminService.updateUserRole(userId, role);
    if (ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    }
  };

  // Story Actions
  const handleCreateNewStoryClick = () => {
    setEditingStory({
      id: "",
      image: "/images/bhangarh.png",
      title: { en: "", hi: "", mr: "" },
      subtitle: { en: "", hi: "", mr: "" },
      category: "Indian Mysteries",
      duration: "8 mins",
      difficulty: "Medium",
      era: "Ancient Era",
      factStatus: "Draft",
      factLabel: "Active Research",
      learningObjectives: [{ en: "", hi: "", mr: "" }],
      knowledgeLevel: "Intermediate",
      relatedTopics: [],
      synopsis: { en: "", hi: "", mr: "" },
      timeline: [],
      narrative: {
        en: { intro: [], background: [], main: [], evidence: [], scientific: [], historical: [], legends: [], facts: [], takeaways: [], conclusion: [] },
        hi: { intro: [], background: [], main: [], evidence: [], scientific: [], historical: [], legends: [], facts: [], takeaways: [], conclusion: [] },
        mr: { intro: [], background: [], main: [], evidence: [], scientific: [], historical: [], legends: [], facts: [], takeaways: [], conclusion: [] }
      },
      explanations: {
        eli10: { en: "", hi: "", mr: "" },
        simple: { en: "", hi: "", mr: "" },
        detailed: { en: "", hi: "", mr: "" },
        academic: { en: "", hi: "", mr: "" },
        revision: { en: "", hi: "", mr: "" }
      },
      qa: [],
      references: [],
      author: currentUser?.name || "Administrator",
      status: "draft"
    });
    setEditorTab("general");
    setShowStoryModal(true);
  };

  const handleEditStoryClick = (story: StoryDetail) => {
    setEditingStory(JSON.parse(jsonCopy(story)));
    setEditorTab("general");
    setShowStoryModal(true);
  };

  const handleDuplicateStory = async (storyId: string) => {
    const res = await adminService.duplicateStory(storyId);
    if (res) {
      setStories(prev => [...prev, res]);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      const ok = await adminService.deleteStory(storyId);
      if (ok) {
        setStories(prev => prev.filter(s => s.id !== storyId));
      }
    }
  };

  const jsonCopy = (o: any) => JSON.stringify(o);

  const saveStoryChanges = async () => {
    if (!editingStory) return;
    if (!editingStory.id) {
      // Slug construction
      editingStory.id = editingStory.title?.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    
    let res = null;
    const isNew = !stories.some(s => s.id === editingStory.id);
    if (isNew) {
      res = await adminService.createStory(editingStory);
    } else {
      res = await adminService.updateStory(editingStory.id!, editingStory);
    }

    if (res) {
      loadAllData();
      setShowStoryModal(false);
      setEditingStory(null);
    } else {
      alert("Failed to save story. Please verify the structure.");
    }
  };

  // Category Actions
  const handleCreateCategoryClick = () => {
    setEditingCategory({ name: "", banner: "", hidden: false, order: 0 });
    setShowCategoryModal(true);
  };

  const handleEditCategoryClick = (cat: Category) => {
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  const saveCategoryChanges = async () => {
    if (!editingCategory) return;
    let res = null;
    if (editingCategory.id) {
      res = await adminService.updateCategory(editingCategory.id, editingCategory);
    } else {
      res = await adminService.createCategory(editingCategory);
    }
    if (res) {
      loadAllData();
      setShowCategoryModal(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (confirm("Delete this category?")) {
      const ok = await adminService.deleteCategory(catId);
      if (ok) {
        setCategories(prev => prev.filter(c => c.id !== catId));
      }
    }
  };

  // Media Actions
  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return;
    setUploadingMedia(true);
    const res = await adminService.uploadMedia(mediaFile);
    setUploadingMedia(false);
    if (res) {
      setMedia(prev => [res, ...prev]);
      setMediaFile(null);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (confirm("Delete this media file?")) {
      const ok = await adminService.deleteMedia(mediaId);
      if (ok) {
        setMedia(prev => prev.filter(m => m.id !== mediaId));
      }
    }
  };

  // Pre-login screen
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <div className="max-w-md w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

          <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">VELORA Admin CMS</h2>
          <p className="text-gray-400 text-center text-sm mb-6">Enter secure administrator credentials</p>

          {authError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-xs px-3 py-2 rounded-lg mb-4 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/20"
            >
              {loading ? <RefreshCw className="animate-spin h-5 w-5 text-white" /> : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Authenticate Access</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      {/* Side Menu Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#0d0d12]/50 flex flex-col backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="font-extrabold text-sm">V</span>
            </div>
            <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">VELORA CMS</span>
          </div>
          <div className="mt-4 flex items-center space-x-2 bg-white/5 border border-white/5 rounded-lg p-2">
            <img src={currentUser?.avatar} alt="Avatar" className="h-8 w-8 rounded-full bg-white/10" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">{currentUser?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "dashboard" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "stories" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Story Manager</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "categories" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <Layers className="h-4 w-4" />
            <span>Category Manager</span>
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "media" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Media Library</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "users" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <UsersIcon className="h-4 w-4" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition ${activeTab === "analytics" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Analytics Charts</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin System Control</h1>
            <p className="text-gray-400 text-sm">Managing the interactive cinematic engine pipeline</p>
          </div>
          <button onClick={loadAllData} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <RefreshCw className="animate-spin h-10 w-10 text-blue-500" />
            <p className="text-gray-400 text-sm">Querying database nodes...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Stats KPIs Cards Grid */}
                <div className="grid grid-cols-4 gap-6">
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Stories</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats?.totalStories}</p>
                    <span className="text-[10px] text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded absolute top-6 right-6">ACTIVE</span>
                  </div>
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Published Stories</p>
                    <p className="text-3xl font-extrabold text-blue-400 mt-2">{stats?.publishedStories}</p>
                    <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded absolute top-6 right-6">LIVE</span>
                  </div>
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Bookmarks Count</p>
                    <p className="text-3xl font-extrabold text-purple-400 mt-2">{stats?.totalBookmarks}</p>
                    <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded absolute top-6 right-6">SAVED</span>
                  </div>
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Readers</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-2">{stats?.totalReaders}</p>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded absolute top-6 right-6">ONLINE</span>
                  </div>
                </div>

                {/* Dashboard Middle Section */}
                <div className="grid grid-cols-3 gap-8">
                  {/* Top Stories list */}
                  <div className="col-span-2 border border-white/10 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Top Story Analytics</h3>
                    <div className="space-y-4">
                      {stats?.topStories.map(ts => (
                        <div key={ts.id} className="flex justify-between items-center border-b border-white/5 pb-3">
                          <div>
                            <p className="font-bold text-sm">{ts.title}</p>
                            <p className="text-xs text-gray-400">Slug: {ts.id}</p>
                          </div>
                          <div className="flex space-x-6">
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Total Reads</p>
                              <p className="text-sm font-extrabold text-blue-400">{ts.reads}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Bookmarks</p>
                              <p className="text-sm font-extrabold text-purple-400">{ts.bookmarks}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Server Activity</h3>
                    <div className="space-y-4">
                      {stats?.recentActivity.map(act => (
                        <div key={act.id} className="flex items-start space-x-3 text-xs border-b border-white/5 pb-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></span>
                          <div>
                            <p className="font-bold text-gray-300">{act.user} - <span className="font-normal text-gray-400">{act.action}</span></p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{act.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STORY MANAGER */}
            {activeTab === "stories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Story Registry Catalog</h2>
                  <button
                    onClick={handleCreateNewStoryClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2 flex items-center space-x-2 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Custom Story</span>
                  </button>
                </div>

                <div className="border border-white/10 bg-[#0d0d12]/50 rounded-xl overflow-hidden backdrop-blur-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Era / Difficulty</th>
                        <th className="px-6 py-4">Verification</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stories.map(story => (
                        <tr key={story.id} className="hover:bg-white/5 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img src={story.image} alt="Cover" className="h-10 w-16 object-cover rounded border border-white/10" />
                              <div>
                                <p className="font-bold text-white">{story.title.en}</p>
                                <p className="text-[10px] text-gray-400">By: {story.author || "Velora Team"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-semibold">{story.category}</td>
                          <td className="px-6 py-4">
                            <p className="text-gray-300">{story.era}</p>
                            <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">{story.difficulty}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${story.factStatus === "Draft" || story.status === "draft" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" : "text-green-400 bg-green-500/10 border-green-500/20"}`}>
                              {story.factStatus || "Published"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              <button onClick={() => handleEditStoryClick(story)} className="p-1.5 border border-white/10 rounded hover:bg-white/10 text-blue-400 transition" title="Edit">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDuplicateStory(story.id)} className="p-1.5 border border-white/10 rounded hover:bg-white/10 text-indigo-400 transition" title="Duplicate">
                                <Copy className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteStory(story.id)} className="p-1.5 border border-white/10 rounded hover:bg-white/10 text-red-400 transition" title="Delete">
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORY MANAGER */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Category Configuration</h2>
                  <button
                    onClick={handleCreateCategoryClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2 flex items-center space-x-2 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="border border-white/10 bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col">
                      <img src={cat.banner} alt="Banner" className="h-32 w-full object-cover border-b border-white/10" />
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-white">{cat.name}</h3>
                            <span className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Order: {cat.order}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Slug: {cat.slug}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Status: {cat.hidden ? <span className="text-red-400 font-semibold">Hidden</span> : <span className="text-green-400 font-semibold">Visible</span>}
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-4 pt-4 border-t border-white/5">
                          <button onClick={() => handleEditCategoryClick(cat)} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-xs py-2 rounded font-semibold transition">Edit</button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="border border-red-500/20 hover:bg-red-500/15 text-red-400 text-xs py-2 px-3 rounded font-semibold transition"><Trash className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MEDIA LIBRARY */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Upload Media Assets</h3>
                  <form onSubmit={handleUploadMedia} className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={e => setMediaFile(e.target.files?.[0] || null)}
                      className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
                    />
                    <button
                      type="submit"
                      disabled={!mediaFile || uploadingMedia}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-40"
                    >
                      {uploadingMedia ? <RefreshCw className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
                      <span>Upload Asset</span>
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {media.map(asset => (
                    <div key={asset.id} className="border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col justify-between">
                      <div className="h-32 w-full rounded overflow-hidden bg-black/30 flex items-center justify-center border border-white/5 relative group">
                        {asset.type.startsWith("image/") ? (
                          <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover" />
                        ) : (
                          <FileText className="h-10 w-10 text-gray-400" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <a href={asset.url} target="_blank" className="p-2 bg-white/10 rounded hover:bg-white/20 text-xs font-bold mr-2">Open Url</a>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold truncate text-gray-200" title={asset.filename}>{asset.filename}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Uploaded: {asset.uploaded_at}</p>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                          <span className="text-[9px] font-bold text-gray-400 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider">{asset.type.split("/")[0]}</span>
                          <button onClick={() => handleDeleteMedia(asset.id)} className="text-red-400 hover:text-red-500 p-1 rounded" title="Delete Asset">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: USER MANAGEMENT */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">User Access Registry</h2>
                <div className="border border-white/10 bg-[#0d0d12]/50 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role Assigned</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Suspension Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-white/5 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img src={u.avatar} alt="Avatar" className="h-8 w-8 rounded-full bg-white/10" />
                              <div>
                                <p className="font-bold">{u.name}</p>
                                <p className="text-[10px] text-gray-500">Streak: {u.streak} days</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{u.email}</td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              className="bg-white/5 border border-white/10 text-white rounded px-2 py-1 text-xs outline-none cursor-pointer focus:border-blue-500"
                            >
                              <option value="Admin">Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="Author">Author</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            {u.suspended ? (
                              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">SUSPENDED</span>
                            ) : (
                              <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">ACTIVE</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleSuspend(u.id)}
                              className={`text-xs font-semibold px-3 py-1 rounded transition border ${u.suspended ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
                            >
                              {u.suspended ? "Restore Access" : "Lock Profile"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: CHARTS ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* Readership bar chart simulation */}
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6">Readership Trend Metrics</h3>
                    <div className="flex items-end justify-between h-48 px-4">
                      {stats?.readershipTrend.map(pt => (
                        <div key={pt.name} className="flex flex-col items-center space-y-2 flex-1">
                          <div className="w-8 bg-blue-600/80 rounded-t hover:bg-blue-600 transition" style={{ height: `${(pt.value / 450) * 120}px` }}></div>
                          <span className="text-[10px] text-gray-400">{pt.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bookmarks trend simulation */}
                  <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6">Bookmarks Addition Log</h3>
                    <div className="flex items-end justify-between h-48 px-4">
                      {stats?.bookmarksTrend.map(pt => (
                        <div key={pt.name} className="flex flex-col items-center space-y-2 flex-1">
                          <div className="w-8 bg-purple-600/80 rounded-t hover:bg-purple-600 transition" style={{ height: `${(pt.value / 55) * 120}px` }}></div>
                          <span className="text-[10px] text-gray-400">{pt.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Categories list */}
                <div className="border border-white/10 bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Trending Knowledge Realms</h3>
                  <div className="space-y-4">
                    {stats?.trendingCategories.map(cat => (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">{cat.name}</span>
                          <span className="text-blue-400 font-bold">{cat.value} Reads</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(cat.value / 1420) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* STORY CMS DETAILED POPUP MODAL */}
      {showStoryModal && editingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-5xl w-full h-[90vh] bg-[#0d0d12] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0d0d12]/80 backdrop-blur">
              <div>
                <h2 className="text-xl font-bold text-white">{editingStory.id ? "Edit Narrative Document" : "Create Narrative Document"}</h2>
                <p className="text-xs text-gray-400 mt-1">Conforms structurally to primary client reader timeline feeds</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStoryModal(false)}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStoryChanges}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-blue-500/10"
                >
                  Commit Changes
                </button>
              </div>
            </div>

            {/* Modal Subtabs selector */}
            <div className="px-6 py-2 border-b border-white/5 bg-white/2 flex space-x-2">
              {(["general", "narrative", "timeline", "explanations", "preview"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setEditorTab(tab)}
                  className={`text-xs font-semibold px-4 py-2 rounded uppercase tracking-wider transition ${editorTab === tab ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:bg-white/5"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Body Forms */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* SUBTAB 1: GENERAL */}
              {editorTab === "general" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Story Slug / ID</label>
                      <input
                        type="text"
                        value={editingStory.id || ""}
                        onChange={e => setEditingStory(prev => ({ ...prev!, id: e.target.value }))}
                        disabled={!!editingStory.id}
                        placeholder="e.g. roopkund-lake"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={editingStory.title?.en || ""}
                        onChange={e => setEditingStory(prev => ({ ...prev!, title: { ...prev!.title!, en: e.target.value } }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Subtitle (English)</label>
                      <input
                        type="text"
                        value={editingStory.subtitle?.en || ""}
                        onChange={e => setEditingStory(prev => ({ ...prev!, subtitle: { ...prev!.subtitle!, en: e.target.value } }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                        <select
                          value={editingStory.category || "Indian Mysteries"}
                          onChange={e => setEditingStory(prev => ({ ...prev!, category: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Indian Mysteries">Indian Mysteries</option>
                          <option value="Space & Science">Space & Science</option>
                          <option value="Temple Architecture">Temple Architecture</option>
                          <option value="Legends & Folklore">Legends & Folklore</option>
                          <option value="Ancient Civilizations">Ancient Civilizations</option>
                          <option value="History">History</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Status</label>
                        <select
                          value={editingStory.status || "draft"}
                          onChange={e => setEditingStory(prev => ({ ...prev!, status: e.target.value as any }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="draft">Draft (CMS Only)</option>
                          <option value="published">Published (Live Feed)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Cover Image Path/URL</label>
                      <input
                        type="text"
                        value={editingStory.image || ""}
                        onChange={e => setEditingStory(prev => ({ ...prev!, image: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Difficulty</label>
                        <input
                          type="text"
                          value={editingStory.difficulty || ""}
                          onChange={e => setEditingStory(prev => ({ ...prev!, difficulty: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Era</label>
                        <input
                          type="text"
                          value={editingStory.era || ""}
                          onChange={e => setEditingStory(prev => ({ ...prev!, era: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Duration</label>
                        <input
                          type="text"
                          value={editingStory.duration || ""}
                          onChange={e => setEditingStory(prev => ({ ...prev!, duration: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Fact Status Label</label>
                        <input
                          type="text"
                          value={editingStory.factLabel || ""}
                          onChange={e => setEditingStory(prev => ({ ...prev!, factLabel: e.target.value as any }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: NARRATIVE MULTILINGUAL */}
              {editorTab === "narrative" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm mb-2 text-blue-400">English Paragraph blocks</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Intro sentences (Comma separated or one per line)</label>
                        <textarea
                          rows={3}
                          value={editingStory.narrative?.en?.intro?.join("\n") || ""}
                          onChange={e => setEditingStory(prev => ({
                            ...prev!,
                            narrative: {
                              ...prev!.narrative!,
                              en: { ...prev!.narrative!.en!, intro: e.target.value.split("\n").filter(Boolean) }
                            }
                          }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Scientific context sentences</label>
                        <textarea
                          rows={3}
                          value={editingStory.narrative?.en?.scientific?.join("\n") || ""}
                          onChange={e => setEditingStory(prev => ({
                            ...prev!,
                            narrative: {
                              ...prev!.narrative!,
                              en: { ...prev!.narrative!.en!, scientific: e.target.value.split("\n").filter(Boolean) }
                            }
                          }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: TIMELINE BUILDER */}
              {editorTab === "timeline" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-blue-400">Chronological Event Timeline</h3>
                    <button
                      onClick={() => setEditingStory(prev => ({
                        ...prev!,
                        timeline: [
                          ...(prev!.timeline || []),
                          { year: "1900", title: { en: "", hi: "", mr: "" }, details: { en: "", hi: "", mr: "" } }
                        ]
                      }))}
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-xs px-3 py-1.5 rounded flex items-center space-x-1.5 transition"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingStory.timeline?.map((step, idx) => (
                      <div key={idx} className="border border-white/10 bg-white/2 rounded-xl p-4 space-y-4 relative">
                        <button
                          onClick={() => setEditingStory(prev => ({
                            ...prev!,
                            timeline: prev!.timeline!.filter((_, sidx) => sidx !== idx)
                          }))}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-500 text-xs font-semibold"
                        >
                          Remove
                        </button>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Year / Era Marker</label>
                            <input
                              type="text"
                              value={step.year}
                              onChange={e => {
                                const newTimeline = [...editingStory.timeline!];
                                newTimeline[idx].year = e.target.value;
                                setEditingStory(prev => ({ ...prev!, timeline: newTimeline }));
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[10px] text-gray-400 mb-1">Title (EN)</label>
                            <input
                              type="text"
                              value={step.title.en}
                              onChange={e => {
                                const newTimeline = [...editingStory.timeline!];
                                newTimeline[idx].title.en = e.target.value;
                                setEditingStory(prev => ({ ...prev!, timeline: newTimeline }));
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Milestone Details (EN)</label>
                          <textarea
                            rows={2}
                            value={step.details.en}
                            onChange={e => {
                              const newTimeline = [...editingStory.timeline!];
                              newTimeline[idx].details.en = e.target.value;
                              setEditingStory(prev => ({ ...prev!, timeline: newTimeline }));
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: EXPLANATIONS */}
              {editorTab === "explanations" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-blue-400 mb-4">ELI10 Simplified Explanation (EN)</h3>
                    <textarea
                      rows={3}
                      value={editingStory.explanations?.eli10?.en || ""}
                      onChange={e => setEditingStory(prev => ({
                        ...prev!,
                        explanations: {
                          ...prev!.explanations!,
                          eli10: { ...prev!.explanations!.eli10!, en: e.target.value }
                        }
                      }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-blue-400 mb-4">Simple Mode Explanation (EN)</h3>
                    <textarea
                      rows={3}
                      value={editingStory.explanations?.simple?.en || ""}
                      onChange={e => setEditingStory(prev => ({
                        ...prev!,
                        explanations: {
                          ...prev!.explanations!,
                          simple: { ...prev!.explanations!.simple!, en: e.target.value }
                        }
                      }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 5: LIVE NARRATIVE PREVIEW */}
              {editorTab === "preview" && (
                <div className="space-y-6 border border-white/5 bg-[#050508]/40 p-6 rounded-2xl">
                  <h3 className="text-2xl font-extrabold text-blue-400">{editingStory.title?.en || "No Title"}</h3>
                  <p className="text-gray-400 text-sm italic">{editingStory.subtitle?.en}</p>
                  
                  <div className="h-64 w-full rounded overflow-hidden mt-4">
                    <img src={editingStory.image} alt="Preview Cover" className="h-full w-full object-cover" />
                  </div>

                  <div className="space-y-4 text-gray-300 text-sm leading-relaxed mt-6">
                    <h4 className="text-sm uppercase tracking-widest text-blue-500 font-bold border-b border-white/5 pb-2">Documentary Prologue</h4>
                    {editingStory.narrative?.en?.intro?.map((s, i) => <p key={i}>{s}</p>)}
                    
                    <h4 className="text-sm uppercase tracking-widest text-blue-500 font-bold border-b border-white/5 pb-2 mt-6">Scientific Investigation</h4>
                    {editingStory.narrative?.en?.scientific?.map((s, i) => <p key={i}>{s}</p>)}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* CATEGORY DIALOG MODAL */}
      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0d0d12] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4">{editingCategory.id ? "Edit Category Config" : "Create New Category"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Category Title</label>
                <input
                  type="text"
                  value={editingCategory.name || ""}
                  onChange={e => setEditingCategory(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Banner Image Link/Path</label>
                <input
                  type="text"
                  value={editingCategory.banner || ""}
                  onChange={e => setEditingCategory(prev => ({ ...prev!, banner: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Order Index</label>
                  <input
                    type="number"
                    value={editingCategory.order || 0}
                    onChange={e => setEditingCategory(prev => ({ ...prev!, order: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Visibility</label>
                  <select
                    value={editingCategory.hidden ? "true" : "false"}
                    onChange={e => setEditingCategory(prev => ({ ...prev!, hidden: e.target.value === "true" }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 text-sm cursor-pointer"
                  >
                    <option value="false">Visible (Visible to Users)</option>
                    <option value="true">Hidden (Admin Only)</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 py-2 border border-white/10 hover:bg-white/5 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCategoryChanges}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-lg transition"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

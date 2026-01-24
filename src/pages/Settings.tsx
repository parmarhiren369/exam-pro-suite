import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  Key,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  userRole: "admin" | "teacher" | "student";
  userName?: string;
  userEmail?: string;
}

export default function Settings({
  userRole,
  userName = "User",
  userEmail = "user@example.com",
}: SettingsProps) {
  const { toast } = useToast();

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    phone: "+91 98765 43210",
    avatar: userName.charAt(0).toUpperCase(),
  });

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    testReminders: true,
    resultAlerts: true,
    scheduleUpdates: true,
    systemUpdates: false,
    weeklyReport: true,
  });

  // Admin-specific settings
  const [adminSettings, setAdminSettings] = useState({
    instituteName: "Hiren's Evaluator Pro",
    instituteEmail: "admin@evaluatorpro.com",
    institutePhone: "+91 12345 67890",
    address: "123 Education Street, City, State",
    autoApproveTeachers: false,
    allowSelfRegistration: true,
    maxStudentsPerBatch: 50,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    fontSize: "medium",
    language: "english",
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleSaveAdminSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Institute settings have been saved successfully.",
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Updated",
      description: "Your appearance preferences have been saved.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality will be available soon.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          {userRole === "admin" && (
            <TabsTrigger value="institute">
              <Building2 className="h-4 w-4 mr-2" />
              Institute
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {profileData.avatar}
                  </span>
                </div>
                <div>
                  <Button variant="outline">Upload Photo</Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Test Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded before scheduled tests
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.testReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        testReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Result Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when results are published
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.resultAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        resultAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Schedule Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about schedule changes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.scheduleUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        scheduleUpdates: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly performance summary
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        weeklyReport: checked,
                      })
                    }
                  />
                </div>

                {userRole === "admin" && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive system and maintenance alerts
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          systemUpdates: checked,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="font-semibold mb-4">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="font-semibold mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Device</p>
                        <p className="text-sm text-muted-foreground">
                          macOS • Chrome • Active now
                        </p>
                      </div>
                      <Badge variant="outline">Current</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value) =>
                      setAppearanceSettings({ ...appearanceSettings, theme: value })
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select
                    value={appearanceSettings.fontSize}
                    onValueChange={(value) =>
                      setAppearanceSettings({ ...appearanceSettings, fontSize: value })
                    }
                  >
                    <SelectTrigger id="font-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={appearanceSettings.language}
                    onValueChange={(value) =>
                      setAppearanceSettings({ ...appearanceSettings, language: value })
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिन्दी</SelectItem>
                      <SelectItem value="gujarati">ગુજરાતી</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAppearance}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institute Tab (Admin Only) */}
        {userRole === "admin" && (
          <TabsContent value="institute">
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle>Institute Settings</CardTitle>
                <CardDescription>
                  Manage institute-wide settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="institute-name">Institute Name</Label>
                    <Input
                      id="institute-name"
                      value={adminSettings.instituteName}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          instituteName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institute-email">Institute Email</Label>
                    <Input
                      id="institute-email"
                      type="email"
                      value={adminSettings.instituteEmail}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          instituteEmail: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institute-phone">Phone Number</Label>
                    <Input
                      id="institute-phone"
                      value={adminSettings.institutePhone}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          institutePhone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-students">Max Students Per Batch</Label>
                    <Input
                      id="max-students"
                      type="number"
                      value={adminSettings.maxStudentsPerBatch}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          maxStudentsPerBatch: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={adminSettings.address}
                    onChange={(e) =>
                      setAdminSettings({ ...adminSettings, address: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-approve Teachers</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve new teacher registrations
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.autoApproveTeachers}
                      onCheckedChange={(checked) =>
                        setAdminSettings({
                          ...adminSettings,
                          autoApproveTeachers: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Self Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to register themselves
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.allowSelfRegistration}
                      onCheckedChange={(checked) =>
                        setAdminSettings({
                          ...adminSettings,
                          allowSelfRegistration: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveAdminSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

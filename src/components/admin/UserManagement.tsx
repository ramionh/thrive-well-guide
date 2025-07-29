import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Edit, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  height_feet?: number;
  height_inches?: number;
  weight_lbs?: number;
  assigned_coach_id?: string;
  is_active: boolean;
  role: string;
  assigned_coach_name?: string;
}

interface Coach {
  id: string;
  full_name: string;
}

const UserManagement = () => {
  const { isAdmin } = useUserRole();
  const [users, setUsers] = useState<User[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "client" as "client" | "coach",
    full_name: "",
    phone: "",
    date_of_birth: "",
    height_feet: "",
    height_inches: "",
    weight_lbs: "",
    assigned_coach_id: "",
    is_active: true
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchCoaches();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          phone,
          date_of_birth,
          height_feet,
          height_inches,
          weight_lbs,
          assigned_coach_id,
          is_active
        `);

      if (error) throw error;

      // Fetch user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch coach names
      const { data: coachProfiles, error: coachError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', profiles?.map(p => p.assigned_coach_id).filter(Boolean) || []);

      if (coachError) throw coachError;

      const formattedUsers = profiles?.map(profile => {
        const userRole = userRoles?.find(ur => ur.user_id === profile.id);
        const assignedCoach = coachProfiles?.find(c => c.id === profile.assigned_coach_id);
        
        return {
          ...profile,
          role: userRole?.role || 'client',
          assigned_coach_name: assignedCoach?.full_name
        };
      }) || [];

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'coach');

      if (rolesError) throw rolesError;

      const coachIds = userRoles?.map(ur => ur.user_id) || [];

      if (coachIds.length === 0) {
        setCoaches([]);
        return;
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', coachIds);

      if (error) throw error;

      setCoaches(profiles || []);
    } catch (error: any) {
      console.error('Error fetching coaches:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError("");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          profile: {
            full_name: formData.full_name,
            phone: formData.phone || null,
            date_of_birth: formData.date_of_birth || null,
            height_feet: formData.height_feet ? parseInt(formData.height_feet) : null,
            height_inches: formData.height_inches ? parseInt(formData.height_inches) : null,
            weight_lbs: formData.weight_lbs ? parseFloat(formData.weight_lbs) : null,
            assigned_coach_id: formData.assigned_coach_id || null,
          }
        }
      });

      if (response.error) throw response.error;

      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setError("");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const updateData: any = {
        user_id: selectedUser.id,
        profile: {
          full_name: formData.full_name,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          height_feet: formData.height_feet ? parseInt(formData.height_feet) : null,
          height_inches: formData.height_inches ? parseInt(formData.height_inches) : null,
          weight_lbs: formData.weight_lbs ? parseFloat(formData.weight_lbs) : null,
          assigned_coach_id: formData.assigned_coach_id || null,
          is_active: formData.is_active
        },
        role: formData.role
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await supabase.functions.invoke('admin-update-user', {
        body: updateData
      });

      if (response.error) throw response.error;

      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to update user');
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "client",
      full_name: "",
      phone: "",
      date_of_birth: "",
      height_feet: "",
      height_inches: "",
      weight_lbs: "",
      assigned_coach_id: "",
      is_active: true
    });
    setSelectedUser(null);
    setError("");
    setShowPassword(false);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      role: user.role as "client" | "coach",
      full_name: user.full_name || "",
      phone: user.phone || "",
      date_of_birth: user.date_of_birth || "",
      height_feet: user.height_feet?.toString() || "",
      height_inches: user.height_inches?.toString() || "",
      weight_lbs: user.weight_lbs?.toString() || "",
      assigned_coach_id: user.assigned_coach_id || "",
      is_active: user.is_active
    });
    setIsEditModalOpen(true);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-destructive" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You need admin privileges to access user management.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Users...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const UserForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isEdit}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value: "client" | "coach") => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{isEdit ? "New Password (leave blank to keep current)" : "Password"}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!isEdit}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height_feet">Height (feet)</Label>
          <Input
            id="height_feet"
            type="number"
            value={formData.height_feet}
            onChange={(e) => setFormData({ ...formData, height_feet: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height_inches">Height (inches)</Label>
          <Input
            id="height_inches"
            type="number"
            min="0"
            max="11"
            value={formData.height_inches}
            onChange={(e) => setFormData({ ...formData, height_inches: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight_lbs">Weight (lbs)</Label>
          <Input
            id="weight_lbs"
            type="number"
            value={formData.weight_lbs}
            onChange={(e) => setFormData({ ...formData, weight_lbs: e.target.value })}
          />
        </div>
      </div>

      {formData.role === 'client' && (
        <div className="space-y-2">
          <Label htmlFor="assigned_coach_id">Assigned Coach</Label>
          <Select value={formData.assigned_coach_id} onValueChange={(value) => setFormData({ ...formData, assigned_coach_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a coach (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No coach assigned</SelectItem>
              {coaches.map((coach) => (
                <SelectItem key={coach.id} value={coach.id}>
                  {coach.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isEdit && (
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Account Active</Label>
        </div>
      )}

      <Button 
        onClick={isEdit ? handleUpdateUser : handleCreateUser} 
        className="w-full"
        disabled={!formData.email || !formData.full_name || (!isEdit && !formData.password)}
      >
        {isEdit ? 'Update User' : 'Create User'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users, roles, and assignments across the platform
              </CardDescription>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new coach or client to the platform
                  </DialogDescription>
                </DialogHeader>
                <UserForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Coach</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'coach' ? 'secondary' : 'outline'}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.assigned_coach_name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'destructive'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information, role, and settings
            </DialogDescription>
          </DialogHeader>
          <UserForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Play, ArrowLeft, Save, X, Plus, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import Navigation from "@/components/ui/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { ApiController } from "@/app/services/apiController"
import { useToast } from "@/hooks/use-toast"

// Employee data interface
interface Employee {
  IdUser: string;
  LoginType: string;
  Email: string;
  TimeCreate: string;
  RoleUsers: string[];
  Name: string;
  IsActive: boolean;
}

// Role interface for API response
interface Role {
  maVaiTro: number;
  tenVaiTro: string;
  moTa: string;
}

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  // Check if user has Admin role
  const isAdmin = hasRole('Admin');

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm")
    } catch (error) {
      return dateString
    }
  }

  // Fetch roles from API
  useEffect(() => {
    if (!isAdmin) return;

    const fetchRoles = async () => {
      try {
        const apiController = new ApiController();
        const roles = await apiController.get<Role[]>('VaiTro');
        setAvailableRoles(roles || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
        // Don't set an error message for roles - fallback to empty list
        setAvailableRoles([]);
      }
    };

    fetchRoles();
  }, [isAdmin]);

  // Fetch employee data
  useEffect(() => {
    if (!isAdmin) {
      return; // Don't fetch if not admin
    }
    
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const apiController = new ApiController();
        const employees = await apiController.get<Employee[]>('NguoiDung/getAllEmployees');
        const foundEmployee = employees.find(emp => emp.IdUser === params.id);
        
        if (foundEmployee) {
          setEmployee(foundEmployee);
          setRoles([...foundEmployee.RoleUsers]);
          setError(null);
        } else {
          setError(`Employee with ID ${params.id} not found`);
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError(err instanceof Error ? err.message : 'An error occurred when fetching employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id, isAdmin]);

  // Add a new role
  const addRole = () => {
    if (selectedRole && !roles.includes(selectedRole)) {
      setRoles([...roles, selectedRole])
      setSelectedRole("")
    }
  }

  // Remove a role
  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter((role) => role !== roleToRemove))
  }

  // Save employee data
  const saveEmployee = async () => {
    if (!employee) return;
    
    setSaving(true);
    setError(null);

    try {
      const apiController = new ApiController();
      
      // Update employee roles using the API - update path for consistency
      await apiController.put(`NguoiDung/${employee.IdUser}/updateRoles`, {
        roles: roles
      });
      
      // Update the local employee state
      setEmployee({
        ...employee,
        RoleUsers: roles
      });
      
      toast({
        title: "✅ Success!",
        description: "Employee roles updated successfully!",
        variant: "default",
        className: "bg-green-100 border-green-500 border",
      });

      setTimeout(() => {
        router.push("/admin/employees");
      }, 2000);
      
    } catch (err) {
      console.error("Error updating employee roles:", err);
      setError(err instanceof Error ? err.message : 'An error occurred when updating employee roles');
      
      toast({
        title: "❌ Update Failed",
        description: "Could not update employee roles. Please try again.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-black",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="p-8">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <ShieldAlert className="h-16 w-16" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                  You don't have permission to access employee management. This feature is only available to administrators.
                </p>
                <Link href="/admin">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-rose-500 text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find an employee with the ID: {params.id}</p>
          <Link href="/admin/employees">
            <Button className="bg-rose-500 hover:bg-rose-600">Back to Employees</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin/employees" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Employees
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Edit Employee</h1>
              <p className="text-gray-600 mt-1">
                ID: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{employee.IdUser}</span>
              </p>
              {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full"
                onClick={saveEmployee}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Employee Form */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={employee.Name} disabled className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={employee.Email} disabled className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loginType">Login Type</Label>
                      <Input id="loginType" value={employee.LoginType} disabled className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Input
                        id="status"
                        value={employee.IsActive ? "Active" : "Inactive"}
                        disabled
                        className={`${employee.IsActive ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="created">Created</Label>
                      <Input id="created" value={formatDate(employee.TimeCreate)} disabled className="bg-gray-50" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Roles Management - Editable */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Roles Management</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add or remove roles for this employee. These roles determine what permissions the employee has in
                    the system.
                  </p>

                  {/* Current Roles */}
                  <div className="mb-4">
                    <Label className="mb-2 block">Current Roles</Label>
                    <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
                      {roles.length === 0 ? (
                        <p className="text-gray-400 text-sm">No roles assigned</p>
                      ) : (
                        roles.map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className={
                              role === "Admin"
                                ? "bg-rose-100 text-rose-800 border-rose-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {role}
                            <button
                              onClick={() => removeRole(role)}
                              className="ml-1 hover:text-red-500"
                              aria-label={`Remove ${role} role`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add New Role */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles
                            .filter((role) => !roles.includes(role.tenVaiTro))
                            .map((role) => (
                              <SelectItem key={role.maVaiTro} value={role.tenVaiTro}>
                                {role.tenVaiTro} - {role.moTa}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={addRole}
                      disabled={!selectedRole || roles.includes(selectedRole) || saving}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JSON Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>JSON Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[300px]">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      ...employee,
                      RoleUsers: roles,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

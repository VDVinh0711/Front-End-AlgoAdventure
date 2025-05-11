"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, ArrowLeft, Plus, Search, Filter, Check, X, Eye, EyeOff, UserCheck, UserX, Edit, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import Navigation from "@/components/ui/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { ApiController } from "@/app/services/apiController"
import { useToast } from "@/components/ui/use-toast"

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

export default function EmployeesPage() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("")
  const [showJsonData, setShowJsonData] = useState<string | null>(null)
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    userId: string
    name: string
    currentStatus: boolean
  }>({
    isOpen: false,
    userId: "",
    name: "",
    currentStatus: false,
  })

  // Check if user has Admin role
  const isAdmin = hasRole('Admin');

  // Fetch employee data from API
  useEffect(() => {
    if (!isAdmin) return;

    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const apiController = new ApiController();
        const data = await apiController.get<Employee[]>('NguoiDung/getAllEmployees');
        setEmployeeList(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err instanceof Error ? err.message : 'An error occurred when fetching employees');
        setEmployeeList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [isAdmin]);

  // Filter employees based on search term
  const filteredEmployees = employeeList.filter(
    (employee) =>
      employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.IdUser.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm")
    } catch (error) {
      return dateString
    }
  }

  // Open confirmation dialog for status change
  const openStatusConfirmation = (userId: string, name: string, currentStatus: boolean) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      name,
      currentStatus,
    })
  }

  // Toggle employee status
  const toggleEmployeeStatus = async () => {
    try {
      setIsLoading(true);
      // Call API to update employee status
      const apiController = new ApiController();
      
      // Use PUT method with query parameters as specified in the API format
      await apiController.put(`NguoiDung/toggleAccountStatus`, {
        MaNguoiDung: confirmDialog.userId,
        IsActive: !confirmDialog.currentStatus
      });

      // Update the local state
      setEmployeeList(prevList => 
        prevList.map(employee => {
          if (employee.IdUser === confirmDialog.userId) {
            return {
              ...employee,
              IsActive: !employee.IsActive,
            };
          }
          return employee;
        })
      );
      
      // Show success toast notification
      toast({
        title: "Status Updated",
        description: `${confirmDialog.name} has been ${!confirmDialog.currentStatus ? 'activated' : 'deactivated'} successfully.`,
        variant: "default",
        className: "bg-green-100 border-green-500 border text-green-800",
      });
      
      // Close the dialog
      setConfirmDialog({
        isOpen: false,
        userId: "",
        name: "",
        currentStatus: false,
      });
      
    } catch (error) {
      console.error("Error updating employee status:", error);
      setError("Failed to update employee status. Please try again.");
      
      // Show error toast notification
      toast({
        title: "Update Failed",
        description: "Could not update employee status. Please try again.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-red-800",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Manage Employees</h1>
              <p className="text-gray-600 mt-1">View and manage employee accounts</p>
              {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}
            </div>
            
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search employees..."
                  className="pl-10 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              <span className="ml-3 text-rose-500">Loading employees...</span>
            </div>
          )}

          {/* Employees Table */}
          {!isLoading && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.IdUser} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{employee.Name}</TableCell>
                          <TableCell>{employee.Email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {employee.RoleUsers.map((role) => (
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
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(employee.TimeCreate)}</TableCell>
                          <TableCell>
                            {employee.IsActive ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <X className="h-3 w-3 mr-1" /> Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  employee.IsActive
                                    ? "text-red-500 border-red-500 hover:bg-red-50"
                                    : "text-green-500 border-green-500 hover:bg-green-50"
                                }
                                onClick={() => openStatusConfirmation(employee.IdUser, employee.Name, employee.IsActive)}
                              >
                                {employee.IsActive ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-1" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                              {/* <Link href={`/admin/employees/edit/${employee.IdUser}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-rose-500 border-rose-500 hover:bg-rose-50"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </Link> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm ? "No employees found matching your search" : "No employee data available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredEmployees.length > 0 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredEmployees.length}</span> of{" "}
                    <span className="font-medium">{employeeList.length}</span> employees
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="rounded-full" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmDialog.currentStatus ? "Deactivate" : "Activate"} Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.currentStatus ? "deactivate" : "activate"} {confirmDialog.name}?
              {confirmDialog.currentStatus
                ? " This will prevent them from accessing the system."
                : " This will restore their access to the system."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={confirmDialog.currentStatus ? "destructive" : "default"}
              className={!confirmDialog.currentStatus ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={toggleEmployeeStatus}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                  Processing...
                </>
              ) : (
                confirmDialog.currentStatus ? "Deactivate" : "Activate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

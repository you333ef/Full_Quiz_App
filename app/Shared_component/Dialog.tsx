'use client'
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const DialogDemo = ({ Save_All_Without, FunGetAll, Get_All_Without_Group, SetOpen, Open, Edit }: any) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [isInitialized, setIsInitialized] = React.useState(false);

  const studentOptions = React.useMemo(
    () =>
      (Save_All_Without || []).map((opt: any) => ({
        value: opt._id,
        label: opt.first_name,
      })),
    [Save_All_Without]
  );

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (Open) {
      setIsInitialized(false);
      // If editing, populate form with Edit data
      if (Edit && Object.keys(Edit).length > 0) {
        const selectedStudents = Array.isArray(Edit.students)
          ? Edit.students.map((id: any) => 
              studentOptions.find((o: any) => o.value === id) || { value: id, label: id }
            )
          : Edit.students
          ? [studentOptions.find((o: any) => o.value === Edit.students) || { value: Edit.students, label: Edit.students }]
          : [];

        // Use setTimeout to ensure the form is ready
        setTimeout(() => {
          setValue("name", Edit.name || "");
          setValue("students", selectedStudents);
          setIsInitialized(true);
        }, 100);
      } else {
        // New group - reset form
        setValue("name", "");
        setValue("students", []);
        setIsInitialized(true);
      }
    } else {
      // Dialog closed - reset everything
      reset({
        name: "",
        students: [],
      });
      setIsInitialized(false);
    }
  }, [Open, Edit, studentOptions, setValue, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    SetOpen(isOpen);
  };

  const onSubmit = async (data: any) => {
    try {
      const studentsArray = Array.isArray(data.students)
        ? data.students.map((s: any) => s.value)
        : data.students && data.students.value
        ? [data.students.value]
        : [];

      const body: any = {
        name: data.name,
        students: studentsArray,
      };

      if (Edit && Edit._id) {
        await axios.put(
          `https://upskilling-egypt.com:3005/api/group/${Edit._id}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        await FunGetAll();
        await Get_All_Without_Group();
        toast.success("Group updated successfully");
        SetOpen(false);
        return;
      }

      await axios.post(
        'https://upskilling-egypt.com:3005/api/group',
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await FunGetAll();
      await Get_All_Without_Group();
      toast.success("Group created successfully");
      SetOpen(false);
    } catch (error: any) {
      console.error("DialogDemo onSubmit error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: 40,
      height: 40,
      borderRadius: 8,
      borderColor: '#d1d5db',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '&:hover': { 
        borderColor: '#6b7280' 
      },
      '&:focus-within': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: 40,
      padding: '0 12px',
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: 40,
    }),
    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
      fontSize: 15,
      lineHeight: '1.5',
      color: '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }),
    container: (base: any) => ({
      ...base,
      width: '100%',
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#f3f4f6',
      borderRadius: 6,
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 14,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#6b7280',
      ':hover': { 
        backgroundColor: '#e5e7eb', 
        color: '#374151' 
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'transparent',
      color: state.isSelected 
        ? '#ffffff' 
        : '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 15,
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    })
  };

  return (
    <>
      <ToastContainer />
      <Dialog.Root open={Open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl border border-gray-200 focus:outline-none">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
              {Edit && Edit._id ? "Edit Group" : "Add Group"}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mb-6">
              Make changes to your group here. Click save when you're done.
            </Dialog.Description>

            {isInitialized && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Group Name
                  </label>
                  <input
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    id="name"
                    placeholder="Enter group name"
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">Group name is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="students"
                  >
                    Students
                  </label>

                  <Controller
                    name="students"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={studentOptions}
                        placeholder="Select students"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={selectStyles}
                        noOptionsMessage={() => "No options"}
                        onChange={(val) => field.onChange(val)}
                        value={field.value || []}
                      />
                    )}
                  />
                  {errors.students && (
                    <p className="text-sm text-red-600">At least one student must be selected</p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close"
              >
                <Cross2Icon className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default DialogDemo;
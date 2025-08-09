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
    formState: { errors },
  } = useForm();

  const clearedRef = React.useRef(false); // لو المستخدم قفل المودال، نمنع إعادة تطبيق الـ Edit كـ default لاحقاً

  const studentOptions = React.useMemo(
    () =>
      (Save_All_Without || []).map((opt: any) => ({
        value: opt._id,
        label: opt.first_name,
      })),
    [Save_All_Without]
  );

  // لما الـ Edit يتغير فعليًا من الأب (يعني فتحنا Edit جديد) نسمح بتطبيقه
  React.useEffect(() => {
    if (Edit && Object.keys(Edit).length > 0) {
      clearedRef.current = false; // Allow applying this edit
      // apply edit values
      const selectedStudents = Array.isArray(Edit.students)
        ? Edit.students.map((id: any) => studentOptions.find((o: any) => o.value === id) || { value: id, label: id })
        : Edit.students
        ? [studentOptions.find((o: any) => o.value === Edit.students) || { value: Edit.students, label: Edit.students }]
        : [];
      reset({
        name: Edit.name || "",
        students: selectedStudents,
      });
    } else {
      // no Edit -> reset to empty
      reset({
        name: "",
        students: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Edit, studentOptions, reset]);

  // تابع يتعامل مع فتح/غلق المودال عشان نمسح الفورم لما يتقفل و نخلي العلم إن المستخدم قفل المودال
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // لو اتقفل المودال - اعمل reset وخلي العلم مفعل عشان لو Edit لسه موجود من الاب، لما يفتح بعد كده يتعامل كـ Add
      reset({ name: "", students: [] });
      clearedRef.current = true;
    } else {
      // لو فتح المودال: لو العلم مفعل يبقى نعتبره فتح Add (يعني هنخلي الفورم فاضي حتى لو Edit لسه موجود)
      if (clearedRef.current) {
        reset({ name: "", students: [] });
      } else {
        // لو مش متفعل، مش محتاج نعمل حاجة لأن الايفكت اللي فوق هيتعامل مع Edit لو فيه
      }
    }
    // نبلغ الأب بتغيير الحالة
    SetOpen(isOpen);
  };

  const onSubmit = async (data: any) => {
    try {
      const studentsArray = Array.isArray(data.students)
        ? data.students.map((s: any) => s.value)
        : data.students && data.students.value
        ? [data.students.value]
        : [];

      // ابني ال body من غير _id (متبعتش _id في الـ body عشان السيرفر يرفضه)
      const body: any = {
        name: data.name,
        students: studentsArray,
      };

      if (Edit && Edit._id) {
        // استخدم الـ id في الـ URL بس
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
        // بعد تحديث، اقفل المودال وافرغ الفورم
        reset({ name: "", students: [] });
        SetOpen(false);
        return;
      }

      // Create new group
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
      reset({ name: "", students: [] });
      SetOpen(false);
    } catch (error: any) {
      // اطبع رسالة الخطأ لو موجودة للمساعدة في الديباغ
      console.error("DialogDemo onSubmit error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog.Root open={Open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-lg focus:outline-none">
            <Dialog.Title className="m-0 text-[17px] font-medium text-gray-900">
              {Edit && Edit._id ? "Edit Group" : "Add Group"}
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-gray-500">
              Make changes to your Group here. Click save when you're done.
            </Dialog.Description>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-[15px] text-violet-800"
                  htmlFor="name"
                >
                  Group Name
                </label>
                <input
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet-800 shadow border border-violet-300 outline-none focus:border-violet-400"
                  id="name"
                  {...register("name", { required: true })}
                />
              </fieldset>

              <fieldset className="mb-[15px]  flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-[15px] text-violet-800"
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
                      placeholder="Select a student"
                      className="basic-multi-select w-full"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: 35,
                          height: 35,
                          borderRadius: 4,
                          borderColor: '#d6bbfb',
                          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
                          '&:hover': { borderColor: '#c4b5fd' },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          height: 35,
                          padding: '0 10px',
                        }),
                        indicatorsContainer: (base) => ({
                          ...base,
                          height: 35,
                        }),
                        input: (base) => ({
                          ...base,
                          margin: 0,
                          padding: 0,
                          fontSize: 15,
                          lineHeight: '1',
                          color: '#5b21b6',
                        }),
                        container: (base) => ({
                          ...base,
                          width: '100%',
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: '#ede9fe',
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: '#5b21b6',
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: '#5b21b6',
                          ':hover': { backgroundColor: '#ddd6fe', color: '#4c1d95' }
                        })
                      }}
                      onChange={(val) => field.onChange(val)}
                      value={field.value || []}
                    />
                  )}
                />
              </fieldset>
              <div className="mt-[25px] flex justify-end">
                <button
                  type="submit"
                  style={{ background: 'rgba(255, 237, 223, 1)', color: '#000', fontWeight: '500', fontSize: '16px' }}
                  className="inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none text-green-800 outline-none outline-offset-1 hover:bg-green-300 focus-visible:outline-2 focus-visible:outline-green-400 select-none"
                >
                  Save changes
                </button>
              </div>
            </form>
            <Dialog.Close asChild>
              <button
                className="absolute right-2.5 top-2.5 inline-flex w-[25px] h-[25px] appearance-none items-center justify-center rounded-full text-violet-800 bg-gray-200 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default DialogDemo;

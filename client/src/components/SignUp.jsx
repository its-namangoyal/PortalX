import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Login } from "../redux/userSlice";
import { apiRequest } from "../utils";
import CustomButton from "./CustomButton";
import Loading from "./Loading";
import TextInput from "./TextInput";

const SignUp = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [accountType, setAccountType] = useState("seeker");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const currentYear = new Date().getFullYear(); 

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  let from = location.state?.from?.pathname || "/";

  const closeModal = () => {}; // setOpen(false);

  const onSubmit = async (data) => {
    let URL = null;
    setIsLoading(true);

    if (isRegister) {
      if (accountType === "seeker") {
        URL = "auth/register";
      } else if (accountType === "company") {
        URL = "companies/register";
      } else if (accountType === "admin") {
        URL = "admin/register"; // Adjust the URL for admin registration
      }
    } else {
      if (accountType === "seeker") {
        URL = "auth/login";
      } else if (accountType === "company") {
        URL = "companies/login";
      } else if (accountType === "admin") {
        URL = "admin/login"; // Adjust the URL for admin login
      }
    }

    try {
      const res = await apiRequest({ url: URL, data: data, method: "POST" });

      if (res?.status === "failed") {
        setErrMsg(res?.message);
      } else {
        if (isRegister) {
          setErrMsg(res?.message);

          setInterval(() => {
            window.location.replace("/");
          }, 5000);
        } else {
          setErrMsg("");
          const newData = {
            token: res?.token,
            ...res?.user,
          };

          dispatch(Login(newData));
          localStorage.setItem("userInfo", JSON.stringify(newData));

          const redirectPath =
            accountType === "seeker" ? "/find-projects" : "/projects";
          window.location.replace(redirectPath);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={open || false}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    {isRegister ? "Create Account" : "Account Sign In"}
                  </Dialog.Title>

                  <div className="w-full flex items-center justify-center py-4 ">
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="flex-1 px-4 py-2 rounded text-sm outline-none bg-white border border-gray-300"
                    >
                      <option value="seeker">Student Account</option>
                      <option value="company">Company / Professor Account</option>
                      <option value="admin">Admin Account</option>
                    </select>
                  </div>

                  <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="email"
                      label="Email Address"
                      placeholder="email@uwindsor.ca"
                      type="email"
                      register={register("email", {
                        required: "Email Address is required!",
                        pattern: {
                          value: accountType === "seeker" ? /^[a-zA-Z0-9._%+-]+@uwindsor\.ca$/i : /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/i,
                          message:
                            accountType === "seeker" ? "Email must be a valid '@uwindsor.ca' address" : "Enter a valid email address",
                            
                        },
                      })}
                      error={errors.email ? errors.email.message : ""}
                    />
                   
                   {isRegister && (
  <div className="w-full flex gap-1 md:gap-2">
    {/* For seeker: Show First Name and Last Name */}
    {accountType === "seeker" && (
      <>
        <div className="w-1/2">
          <TextInput
            name="firstName"
            label="First Name"
            placeholder="Enter First Name"
            type="text"
            register={register("firstName", {
              required: "First Name is required",
            })}
            error={errors.firstName ? errors.firstName.message : ""}
          />
        </div>

        <div className="w-1/2">
          <TextInput
            name="lastName"
            label="Last Name"
            placeholder="Enter Last Name"
            type="text"
            register={register("lastName", {
              required: "Last Name is required",
            })}
            error={errors.lastName ? errors.lastName.message : ""}
          />
        </div>
      </>
    )}

    {/* For admin: Show First Name and Last Name */}
    {accountType === "admin" && (
      <>
        <div className="w-1/2">
          <TextInput
            name="firstName"
            label="First Name"
            placeholder="Enter First Name"
            type="text"
            register={register("firstName", {
              required: "First Name is required",
            })}
            error={errors.firstName ? errors.firstName.message : ""}
          />
        </div>

        <div className="w-1/2">
          <TextInput
            name="lastName"
            label="Last Name"
            placeholder="Enter Last Name"
            type="text"
            register={register("lastName", {
              required: "Last Name is required",
            })}
            error={errors.lastName ? errors.lastName.message : ""}
          />
        </div>
      </>
    )}

    {/* For company: Show Company/Professor Name */}
    {accountType === "company" && (
      <div className="w-full">
        <TextInput
          name="name"
          label="Company/Professor Name"
          placeholder="Company/Professor Name"
          type="text"
          register={register("name", {
            required: "Company Name is required",
          })}
          error={errors.name ? errors.name.message : ""}
        />
      </div>
    )}
  </div>
)}

{isRegister && accountType === "admin" && (
  <div className="w-full">
    {/* Semester Dropdown */}
    <div className="mt-4">
      <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
        Semester
      </label>
      <select
        id="semester"
        {...register("semester", { required: "Semester is required" })}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
      >
        <option value="">Select Semester</option>
        <option value="fall">Fall</option>
        <option value="winter">Winter</option>
        <option value="summer">Summer</option>
      </select>
      {errors.semester && (
        <p className="mt-1 text-red-600">{errors.semester.message}</p>
      )}
    </div>

    {/* Year Input */}
    <div className="mt-4">
      <TextInput
        name="year"
        label="Year"
        placeholder="Enter Year"
        type="number"
        register={register("year", {
          required: "Year is required",
          validate: {
            validYear: value => value <= currentYear || "Year must be less than or equal to current year",
          },
        })}
        error={errors.year ? errors.year.message : ""}
      />
    </div>
  </div>
)}
                    {isRegister && accountType === "seeker" && (
                      <div className="w-full">
                        <TextInput
                          name="studentID"
                          label="Student ID"
                          placeholder="Enter your student ID"
                          type="text"
                          register={register("studentID", {
                            required: "Student ID is required",
                          })}
                          error={errors.studentID ? errors.studentID.message : ""}
                        />
                      </div>
                    )}
                    {isRegister && accountType == "company" && (
                      <div className="w-full">
                        <TextInput
                          name="userID"
                          label="User ID"
                          placeholder="Enter your User ID"
                          type="text"
                          register={register("userID", {
                            required: "User ID is required",
                          })}
                          error={errors.userID ? errors.userID.message : ""}
                        />
                      </div>
                    )}

                    <div className="w-full flex gap-1 md:gap-2">
                      <div className={`${isRegister ? "w-1/2" : "w-full"}`}>
                        <TextInput
                          name="password"
                          label="Password"
                          placeholder="Password"
                          type="password"
                          register={register("password", {
                            required: "Password is required!",
                          })}
                          error={errors.password ? errors.password?.message : ""}
                        />
                      </div>
                      {isRegister && (
                        <div className="w-1/2">
                          <TextInput
                            label="Confirm Password"
                            placeholder="Password"
                            type="password"
                            register={register("cPassword", {
                              validate: (value) => {
                                const { password } = getValues();

                                if (password !== value) {
                                  return "Passwords do not match";
                                }
                              },
                            })}
                            error={errors.cPassword ? errors.cPassword.message : ""}
                          />
                        </div>
                      )}
                    </div>
                    {errMsg && (
                      <p className="text-sm text-red-600">{errMsg}</p>
                    )}
                    <div className="mt-2">
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <CustomButton
                          type="submit"
                          containerStyles={`inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800`}
                          title={isRegister ? "Create Account" : "Login Account"}
                        />
                      )}
                    </div>
                  </form>
                  <div className="mt-4 text-sm">
                    {isRegister ? (
                      <p>
                        Already have an account?{" "}
                        <span
                          onClick={() => setIsRegister(false)}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          Sign In
                        </span>
                      </p>
                    ) : (
                      <p>
                        Don't have an account?{" "}
                        <span
                          onClick={() => setIsRegister(true)}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          Create Account
                        </span>
                      </p>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SignUp;

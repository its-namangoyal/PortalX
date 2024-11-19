import { Dialog, Transition } from "@headlessui/react";
import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Login } from "../redux/userSlice";
import { apiRequest } from "../utils";
import CustomButton from "./CustomButton";
import Loading from "./Loading";
import TextInput from "./TextInput";

const SignUp = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [accountType, setAccountType] = useState("seeker");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setIsLoading(true);

    let URL = isRegister
      ? accountType === "seeker"
        ? "auth/register"
        : accountType === "company"
        ? "companies/register"
        : "admin/register"
      : accountType === "seeker"
      ? "auth/login"
      : accountType === "company"
      ? "companies/login"
      : "admin/login";

    // Include additional fields based on account type
    const additionalData = {};
    if (accountType === "seeker") {
      additionalData.studentID = data.studentID;
    } else if (accountType === "company") {
      additionalData.professorID = data.professorID;
    }

    try {
      const res = await apiRequest({
        url: URL,
        data: { ...data, ...additionalData },
        method: "POST",
      });

      if (res?.status === "failed") {
        setErrMsg(res?.message);
      } else {
        if (isRegister) {
          setErrMsg(res?.message);
          setTimeout(() => window.location.replace("/"), 5000);
        } else {
          setErrMsg("");
          const newData = { token: res?.token, ...res?.user };
          dispatch(Login(newData));
          localStorage.setItem("userInfo", JSON.stringify(newData));
          window.location.replace(accountType === "seeker" ? "/find-projects" : "/projects");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountTypeFields = () => {
    if (accountType === "seeker") {
      return (
        <div className="w-full space-y-4">
          <div className="w-full flex gap-2 md:gap-4">
            <div className="w-1/2">
              <TextInput
                name="firstName"
                label="First Name"
                placeholder="Enter First Name"
                type="text"
                register={register("firstName", { required: "First Name is required" })}
                error={errors.firstName ? errors.firstName.message : ""}
                className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="w-1/2">
              <TextInput
                name="lastName"
                label="Last Name"
                placeholder="Enter Last Name"
                type="text"
                register={register("lastName", { required: "Last Name is required" })}
                error={errors.lastName ? errors.lastName.message : ""}
                className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
          <div className="w-full">
            <TextInput
              name="studentID"
              label="Student ID"
              placeholder="Enter Student ID"
              type="text"
              register={register("studentID", { required: "Student ID is required" })}
              error={errors.studentID ? errors.studentID.message : ""}
              className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
      );
    } else if (accountType === "company") {
      return (
        <div className="w-full space-y-4">
          <TextInput
            name="name"
            label="Company/Professor Name"
            placeholder="Company/Professor Name"
            type="text"
            register={register("name", { required: "Company Name is required" })}
            error={errors.name ? errors.name.message : ""}
            className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
          />
          <TextInput
            name="professorID"
            label="Professor ID"
            placeholder="Enter Professor ID"
            type="text"
            register={register("professorID", { required: "Professor ID is required" })}
            error={errors.professorID ? errors.professorID.message : ""}
            className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
          />
        </div>
      );
    }
  };

  return (
    <Transition appear show={true} as="div">
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-300">
              <Dialog.Title as="h3" className="text-2xl font-bold text-gray-800 text-left">
                {isRegister ? "Create Account" : "Account Sign In"}
              </Dialog.Title>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="seeker">Student Account</option>
                  <option value="company">Company / Professor Account</option>
                  <option value="admin">Admin Account</option>
                </select>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                  name="email"
                  label="Email Address"
                  placeholder="email@uwindsor.ca"
                  type="email"
                  register={register("email", {
                    required: "Email Address is required!",
                    pattern: {
                      value: accountType === "seeker" 
                        ? /^[a-zA-Z0-9._%+-]+@uwindsor\.ca$/i 
                        : /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/i,
                      message: accountType === "seeker" 
                        ? "Email must be a valid '@uwindsor.ca' address" 
                        : "Enter a valid email address",
                    },
                  })}
                  error={errors.email ? errors.email.message : ""}
                  className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                />

                {isRegister && renderAccountTypeFields()}

                <div className="mt-4 space-y-2">
                  <TextInput
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    register={register("password", { required: "Password is required" })}
                    error={errors.password ? errors.password.message : ""}
                    className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                  />
                  {isRegister && (
                    <TextInput
                      name="cPassword"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      type="password"
                      register={register("cPassword", {
                        validate: value => value === getValues("password") || "Passwords do not match"
                      })}
                      error={errors.cPassword ? errors.cPassword.message : ""}
                      className="border-2 border-blue-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                    />
                  )}
                </div>

                {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}
                <div className="mt-6">
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      containerStyles="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                      title={isRegister ? "Sign Up" : "Sign In"}
                    />
                  )}
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignUp;

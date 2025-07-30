import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../supabaseClient";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { role: values.role },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess("Account created successfully! Please check your email to confirm your account and then sign in.");
        resetForm();
      }
    } catch (err) {
      setError("Sign up failed. Please try again later.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600">Sign up to access your dashboard</p>
        </div>

        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-11"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-11"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="h-11"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className="h-11 w-full border rounded px-3"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="support">Support</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="text-red-600 text-sm" />
                  </div>

                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium" disabled={loading || isSubmitting}>
                    {loading || isSubmitting ? "Signing Up..." : "Sign Up"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;

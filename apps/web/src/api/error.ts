// import axios from "axios";

// export function getApiErrorMessage(err: unknown, fallback = "Something went wrong") {
//   if (axios.isAxiosError(err)) {
//     const msg =
//       (err.response?.data as any)?.message ||
//       (err.response?.data as any)?.error ||
//       err.message;

//     return msg || fallback;
//   }
//   if (err instanceof Error) return err.message || fallback;
//   return fallback;
// }

import axios from "axios";

type ApiErrShape = {
  message?: string;
  error?: string;
  errors?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[]>;
  };
};

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrShape | undefined;

    // 1) Standard message
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    // 2) Zod-style errors
    const fieldErrors = data?.errors?.fieldErrors;
    if (fieldErrors) {
      const firstKey = Object.keys(fieldErrors)[0];
      const firstMsg = firstKey ? fieldErrors[firstKey]?.[0] : undefined;
      if (firstMsg) return firstMsg; // e.g. "Invalid email address"
    }

    const formErrors = data?.errors?.formErrors;
    if (formErrors && formErrors.length) return formErrors[0];

    // 3) Axios fallback
    return err.message || fallback;
  }

  if (err instanceof Error) return err.message || fallback;
  return fallback;
}
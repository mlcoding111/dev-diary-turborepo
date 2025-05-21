// // SERVER ACTION
// "use server";

// import { registerUserSchema, TRegisterUser } from "@repo/types/schema";
// import { revalidateTag } from "next/cache";
// import { TFormSubmitResponse, TApiResponse } from "@repo/types/api";
// import { TSerializedMe } from "@repo/types/schema";
// import { validateForm } from "@/utils/parser";

// // The server action takes either undefined or a TFormSubmitResponse<any> as previous state
// // and returns a TFormSubmitResponse<TSerializedMe>
// export async function signup(
//   prevState: TFormSubmitResponse<TRegisterUser | TSerializedMe> | undefined,
//   formData: FormData,
// ): Promise<TFormSubmitResponse<TSerializedMe>> {
//   const validationResult = await validateForm<TRegisterUser>(registerUserSchema, formData);

//   if (!validationResult.success) {
//     // Return validation errors with the same shape as TFormSubmitResponse
//     return { 
//       success: false, 
//       errors: validationResult.errors
//     };
//   }

//   const { email, password, first_name, last_name } = validationResult.data as TRegisterUser;

//   try {
//     const response = await fetch("http://localhost:3000/api/auth/signup", {
//       method: "POST",
//       body: JSON.stringify({ email, password, first_name, last_name }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.ok) {
//       revalidateTag("me");
//     }

//     const data = await response.json() as TApiResponse<TSerializedMe>;
//     return data;
//   } catch (error: unknown) {
//     return {
//       success: false,
//       message: "An error occurred during signup"
//     };
//   }
// }

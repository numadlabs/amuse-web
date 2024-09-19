import { axiosClient } from "../axios";
import { BugReportType } from "../types";

export function generateTap() {
  return axiosClient.post("/taps/generate").then((response) => {
    return response;
  });
}

export function registerDeviceNotification({
  pushToken,
}: {
  pushToken: string;
}) {
  return axiosClient.post("/devices", { pushToken }).then((response) => {
    return response;
  });
}

export function generatePerkQr({ id }: { id: string }) {
  return axiosClient.post(`/userBonus/${id}/generate`).then((response) => {
    return response;
  });
}

export function useBonus(id: string) {
  return axiosClient
    .post(`/userBonus/${id}/use`, { restaurantId: id })
    .then((response) => {
      return response;
    });
}

export function redeemBonus(encryptedData: string) {
  return axiosClient
    .post("/userBonus/redeem", { encryptedData })
    .then((response) => {
      return response;
    });
}

export function redeemTap(encryptedData: string) {
  return axiosClient
    .post("/taps/redeem", { encryptedData })
    .then((response) => {
      return response;
    });
}

export function getAcard(cardId: string) {
  return axiosClient.post(`/userCards/${cardId}/buy`).then((response) => {
    return response;
  });
}

export function purchasePerk(bonusId: string) {
  return axiosClient.post(`/userBonus/${bonusId}/buy`).then((response) => {
    return response;
  });
}

export async function updateUserEmail({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: number;
}) {
  const response = await axiosClient.put(`/users/updateEmail`, {
    email,
    verificationCode,
  });
  if (response.data.success) {
    return response.data.data;
  } else {
    console.log(response.data.error);
  }
}
export async function updateUserInfo({
  userId,
  data,
}: {
  userId: string | null;
  data: any;
}) {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "profilePicture" && data[key]) {
      formData.append("profilePicture", data[key]);
    } else {
      formData.append(key, data[key]);
    }
  });

  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `/users/${userId}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    maxContentLength: 10 * 1024 * 1024, // 10MB max file size
  };

  const response = await axiosClient.request(config);
  return response.data;
}

export async function forgotPassword({
  email,
  verificationCode,
  password,
}: {
  email: string;
  verificationCode: string;
  password: string;
}) {
  const numericCode = parseInt(verificationCode);

  return axiosClient
    .put("/auth/forgotPassword", {
      email,
      verificationCode: numericCode,
      password,
    })
    .then((response) => {
      return response.data;
    });
}
export async function deleteUser() {
  return axiosClient.delete("/users");
}
export async function updatePassword({
  prefix,
  telNumber,
}: {
  prefix: string;
  telNumber: string;
}) {
  return axiosClient
    .post("/auth/forgotPassword/otp", { prefix, telNumber })
    .then((response) => {
      return response;
    });
}

export async function checkPasswordOtp({
  prefix,
  telNumber,
  telVerificationCode,
}: {
  prefix: string;
  telNumber: string;
  telVerificationCode: number;
}) {
  return axiosClient
    .post("/auth/forgotPassword/checkOTP", {
      prefix,
      telNumber,
      telVerificationCode,
    })
    .then((response) => {
      return response;
    });
}

export async function sendOtpApi({ email }: { email: string }) {
  return axiosClient.post("/auth/sendOTP", { email }).then((response) => {
    return response.data;
  });
}

export async function verifyEmailOtp({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: number;
}) {
  return axiosClient
    .post("/auth/verifyEmail", { email, verificationCode })
    .then((response) => {
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function checkOtp({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: string;
}) {
  const numericCode = parseInt(verificationCode);
  return axiosClient
    .post("/auth/checkOTP", { email, verificationCode: numericCode })
    .then((response) => {
      return response.data;
    });
}

export async function registerUser({
  nickname,
  email,
  password,
  verificationCode,
}: {
  nickname: string;
  email: string;
  password: string;
  verificationCode: string;
}) {
  const numericCode = parseInt(verificationCode);

  return axiosClient
    .post("/auth/register", {
      nickname,
      email,
      password,
      verificationCode: numericCode,
    })
    .then((response) => {
      return response.data;
    });
}

export async function checkEmail({ email }: { email: string }) {
  return axiosClient.post("/auth/checkEmail", { email }).then((response) => {
    return response.data;
  });
}

export async function submitBugReport(bugReport: BugReportType): Promise<any> {
  return axiosClient.post("/bug-reports", bugReport).then((response) => {
    return response.data;
  });
}

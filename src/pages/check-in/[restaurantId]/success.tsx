import { useRouter } from "next/router";
import React from "react";

export default function Success() {
  const router = useRouter();
  const { restaurantId } = router.query;
  console.log("🚀 ~ Success ~ restaurantId:", restaurantId);
  return <div>success</div>;
}

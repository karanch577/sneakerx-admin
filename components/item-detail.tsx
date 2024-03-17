import React from "react";
import { number } from "zod";

interface ItemDetailProps {
    title: string;
    value: string | number;
    className?: string
}

function ItemDetail({title, value, className=""}: ItemDetailProps) {
  return (
    <div className={className}>
      <p className="font-semibold">{title}</p>
      <p>{value}</p>
    </div>
  );
}

export default ItemDetail;

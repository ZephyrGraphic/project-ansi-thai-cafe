"use client";

import { forwardRef } from "react";
import type { Order, Table, OrderDetail, Menu, Payment, Member } from "@prisma/client";

type OrderWithDetails = Order & {
  table: Table;
  orderItems: (OrderDetail & { menu: Menu })[];
  payment: Payment | null;
  member?: Member | null;
};

interface ReceiptProps {
  order: OrderWithDetails;
  member?: Member | null;
  pointsEarned?: number;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ order, member, pointsEarned }, ref) => {
    const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div
        ref={ref}
        className="bg-white p-4 font-mono text-xs"
        style={{ width: "280px" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">THAI CAFE</h1>
          <p className="text-[10px] text-gray-600">Authentic Thai Cuisine</p>
          <p className="text-[10px] text-gray-500 mt-1">
            Jl. Contoh No. 123, Kota
          </p>
          <p className="text-[10px] text-gray-500">Telp: 021-12345678</p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400 my-2"></div>

        {/* Order Info */}
        <div className="mb-3 text-[11px]">
          <div className="flex justify-between">
            <span>No. Order:</span>
            <span className="font-semibold">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Meja:</span>
            <span className="font-semibold">{order.table.tableNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{formatDate(order.payment?.createdAt || order.createdAt)}</span>
          </div>
          {member && (
            <div className="flex justify-between">
              <span>Member:</span>
              <span className="font-semibold">{member.name}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400 my-2"></div>

        {/* Items */}
        <div className="mb-3">
          {order.orderItems.map((item) => (
            <div key={item.id} className="mb-2">
              <div className="flex justify-between">
                <span className="flex-1 truncate">{item.menu.name}</span>
              </div>
              <div className="flex justify-between text-gray-600 pl-2">
                <span>
                  {item.qty} x {formatCurrency(item.menu.price)}
                </span>
                <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
              </div>
              {item.notes && (
                <p className="text-[9px] text-gray-500 pl-2 italic">* {item.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400 my-2"></div>

        {/* Total */}
        <div className="mb-3">
          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-600 mt-1">
            <span>Metode Pembayaran:</span>
            <span className="font-semibold">{order.payment?.method || "CASH"}</span>
          </div>
        </div>

        {/* Member Points */}
        {member && pointsEarned && pointsEarned > 0 && (
          <>
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            <div className="text-center text-[11px] mb-3">
              <p className="font-semibold">🎁 POIN MEMBER</p>
              <p className="text-gray-600">
                Poin didapat: <span className="font-bold text-green-700">+{pointsEarned}</span>
              </p>
              <p className="text-gray-600">
                Total poin: <span className="font-bold">{(member.points || 0) + pointsEarned}</span>
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-dashed border-gray-400 my-2"></div>
        <div className="text-center text-[10px] text-gray-500">
          <p className="font-semibold mb-1">Terima Kasih!</p>
          <p>Selamat menikmati hidangan kami</p>
          <p className="mt-1">~ Thai Cafe ~</p>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <>
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            <div className="text-[10px] text-gray-500">
              <span className="font-semibold">Catatan:</span> {order.notes}
            </div>
          </>
        )}
      </div>
    );
  }
);

Receipt.displayName = "Receipt";

export default Receipt;

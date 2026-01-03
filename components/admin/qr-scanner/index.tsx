"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../libs/auth";
import { api } from "../../../libs/api";
import type { User } from "../../../libs/types";
import AdminLayout from "../components/layout";
import toast from "react-hot-toast";
import { Html5Qrcode } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Camera,
  CameraOff,
  CheckCircle,
  User as UserIcon,
  Hash,
} from "lucide-react";

export default function QRScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [manualName, setManualName] = useState("");
  const [lastCheckedInUser, setLastCheckedInUser] = useState<User | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<User[]>([]);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const lastProcessedQrRef = useRef<string | null>(null);
  const lastProcessedTimeRef = useRef<number>(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin");
      return;
    }
  }, [router]);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
      // Clear any pending timeouts
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setCameraError(null);
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setScanning(true);
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      setCameraError(
        "Không thể truy cập camera. Lưu ý: Trên điện thoại, bạn cần truy cập qua HTTPS hoặc localhost để sử dụng camera. Nếu đang dùng IP nội bộ (http://192.168...), trình duyệt sẽ chặn camera vì lý do bảo mật."
      );
      toast.error("Không thể khởi động camera");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    // Prevent duplicate processing
    const now = Date.now();
    const timeSinceLastProcess = now - lastProcessedTimeRef.current;

    // If same QR code was processed recently (within 2 seconds), ignore it
    if (
      decodedText === lastProcessedQrRef.current &&
      timeSinceLastProcess < 2000
    ) {
      return;
    }

    // If already processing a request, ignore new scans
    if (isProcessing) {
      return;
    }

    // Update refs to track this QR code
    lastProcessedQrRef.current = decodedText;
    lastProcessedTimeRef.current = now;

    // Process the check-in
    await handleCheckIn(decodedText);
  };

  const onScanError = () => {
    // Ignore scan errors (they happen frequently while scanning)
    console.log("Scan error");
  };

  const handleCheckIn = async (userId: string) => {
    // Prevent concurrent requests
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await api.checkInUser(userId);
      const user = result.user;

      toast.success(`Check-in thành công: ${user.full_name}!`);
      setLastCheckedInUser(user);

      // Add to recent check-ins
      setRecentCheckIns((prev) => {
        const updated = [user, ...prev];
        return updated.slice(0, 10); // Keep only last 10
      });

      // Clear the last processed QR after successful check-in to allow re-scanning same user later
      // But add a cooldown period
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      processingTimeoutRef.current = setTimeout(() => {
        lastProcessedQrRef.current = null;
        lastProcessedTimeRef.current = 0;
      }, 2000); // 2 second cooldown
    } catch (error: any) {
      console.error("Error checking in user:", error);
      if (error.response?.status === 400) {
        toast.error("Người dùng đã check-in rồi");
        // Clear refs on error to allow retry
        lastProcessedQrRef.current = null;
        lastProcessedTimeRef.current = 0;
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy người dùng");
        // Clear refs on error to allow retry
        lastProcessedQrRef.current = null;
        lastProcessedTimeRef.current = 0;
      } else {
        toast.error("Không thể check-in");
        // Clear refs on error to allow retry
        lastProcessedQrRef.current = null;
        lastProcessedTimeRef.current = 0;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ... (lines omitted)

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) {
      toast.error("Vui lòng nhập tên người tham dự");
      return;
    }

    try {
      const result = await api.lookupUserByName(manualName);
      if (result.count === 0) {
        toast.error("Không tìm thấy người tham dự nào với tên này");
      } else if (result.count === 1) {
        // Exact match or single result, proceed to check-in
        await handleCheckIn(result.users[0]._id);
        setManualName("");
      } else {
        toast.error(
          `Tìm thấy ${result.count} người. Vui lòng nhập tên cụ thể hơn.`
        );
      }
    } catch (error) {
      console.error("Error looking up user:", error);
      toast.error("Lỗi khi tìm kiếm người tham dự");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quét QR Check-in</h1>
          <p className="text-gray-600 mt-2">
            Quét mã QR của người tham dự để check-in vào sự kiện
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Quét QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                id="qr-reader"
                className="w-full rounded-lg overflow-hidden bg-gray-900"
                style={{ minHeight: scanning ? "300px" : "0px" }}
              />

              {cameraError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {cameraError}
                </div>
              )}

              <div className="flex gap-2">
                {!scanning ? (
                  <Button onClick={startScanning} className="w-full">
                    <Camera className="w-4 h-4" />
                    Bắt Đầu Quét
                  </Button>
                ) : (
                  <Button
                    onClick={stopScanning}
                    variant="destructive"
                    className="w-full"
                  >
                    <CameraOff className="w-4 h-4" />
                    Dừng Quét
                  </Button>
                )}
              </div>

              {/* Manual Input */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Hoặc nhập tên người tham gia thủ công:
                </p>
                <form onSubmit={handleManualCheckIn} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Tên người tham gia"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                  />
                  <Button type="submit">Check-in</Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Last Checked-in User */}
          <div className="space-y-6">
            {lastCheckedInUser && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    Check-in Thành Công
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <UserIcon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">
                        {lastCheckedInUser.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            lastCheckedInUser.role === "employee"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            lastCheckedInUser.role === "employee"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }
                        >
                          {lastCheckedInUser.role === "employee"
                            ? "Nhân viên"
                            : "Khách mời"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">
                      Số may mắn:{" "}
                      <span className="font-bold text-[#3432c7]">
                        {lastCheckedInUser.lucky_number}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Check-ins */}
            <Card>
              <CardHeader>
                <CardTitle>Check-in Gần Đây</CardTitle>
              </CardHeader>
              <CardContent>
                {recentCheckIns.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Chưa có check-in nào
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentCheckIns.map((user, index) => (
                      <div
                        key={`${user._id}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Số may mắn: {user.lucky_number}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

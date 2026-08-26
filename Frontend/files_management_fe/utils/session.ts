import {
    Monitor,
    Smartphone,
    Globe,
    Laptop,
} from "lucide-react";

export function parseDeviceName(deviceName: string | null) {
    if (!deviceName) {
        return {
            browser: "Unknown",
            device: "Unknown",
        };
    }

    const [browser, device] = deviceName.split(" on ");

    return {
        browser: browser || "Unknown",
        device: device || "Unknown",
    };
}

export function getDeviceIcon(deviceName: string | null) {
    const value = deviceName?.toLowerCase() ?? "";

    if (
        value.includes("iphone") ||
        value.includes("android") ||
        value.includes("mobile")
    ) {
        return Smartphone;
    }

    if (value.includes("chrome")) {
        return Laptop;
    }

    if (
        value.includes("windows") ||
        value.includes("mac") ||
        value.includes("linux")
    ) {
        return Monitor;
    }

    return Globe;
}
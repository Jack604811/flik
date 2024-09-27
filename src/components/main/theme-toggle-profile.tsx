"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Check } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = (value: SetStateAction<string>) => {
    setTheme(value);
  };

  return (
    <div className="w-full justify-left max-w-6xl mx-auto">
      <RadioGroup value={theme} onValueChange={handleThemeChange}>
        <div className="grid grid-cols-3 gap-6">
          {["light", "dark", "system"].map((themeOption) => (
            <div key={themeOption} className="text-sm text-muted-foreground">
              <div
                className={`cursor-pointer relative ${
                  theme === themeOption ? "border-2 border-black dark:border-white rounded-lg" : ""
                }`}
                onClick={() => handleThemeChange(themeOption)}
              >
                <Card
                  className={`overflow-hidden h-30 md:h-40 lg:h-50 ${
                    themeOption === "system" ? "flex" : ""
                  }`}
                >
                  <CardContent
                    className={`p-4 lg:p-6' ${
                      themeOption === "dark"
                        ? "bg-black"
                        : "bg-white"
                    } ${
                      themeOption === "system" ? "flex-1" : ""
                    } h-30 md:h-40 lg:h-50`}
                  >
                    <div className="flex items-center space-x-1 mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="space-y-2">
                      <div
                        className={`h-2 lg:h-3 rounded ${
                          themeOption === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                        }`}
                        style={{ width: "60%" }}
                      />
                      <div
                        className={`h-2 lg:h-3 rounded ${
                          themeOption === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                        }`}
                        style={{ width: "80%" }}
                      />
                      <div
                        className={`h-2 lg:h-3 rounded ${
                          themeOption === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                        }`}
                        style={{ width: "70%" }}
                      />
                      <div
                        className={`h-2 lg:h-3 rounded ${
                          themeOption === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                        }`}
                        style={{ width: "40%" }}
                      />
                      <div
                        className={`h-2 lg:h-3 rounded ${
                          themeOption === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                        }`}
                        style={{ width: "50%" }}
                      />
                    </div>
                  </CardContent>
                  {themeOption === "system" && (
                    <CardContent className="p-4 bg-black flex-1 h-full">
                      <div className="flex items-center space-x-1 mb-4 h-30">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <div className="space-y-4">
                        <div
                          className="h-2 lg:h-3  rounded bg-gray-700"
                          style={{ width: "60%" }}
                        />
                        <div
                          className="h-2 lg:h-3 rounded bg-gray-700"
                          style={{ width: "80%" }}
                        />
                        <div
                          className="h-2 lg:h-3 rounded bg-gray-700"
                          style={{ width: "70%" }}
                        />
                        <div
                          className="h-2 lg:h-3  rounded bg-gray-700"
                          style={{ width: "40%" }}
                        />
                        <div
                          className="h-2 lg:h-3 rounded bg-gray-700"
                          style={{ width: "50%" }}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
                {theme === themeOption && (
                  <div className="absolute bottom-2 right-2 bg-black dark:bg-green-200 rounded-full p-1">
                    <Check className="h-3 w-3 text-white dark:text-black" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className="font-medium text-lg">
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

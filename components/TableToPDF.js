"use client";
import React, { useRef } from "react";
import WeeklyPlan from "@/components/WeeklyPlan";
import { BiSolidDownload } from "react-icons/bi";
import dynamic from "next/dynamic";
// Dynamically import browser-only libraries
const html2canvas = dynamic(() => import("html2canvas-pro"), { ssr: false });

const jsPDF = dynamic(() => import("jspdf"), { ssr: false });
const TableToPDF = ({ data }) => {
  const pdfContainerRef = useRef(null);

  const generatePDFfromUI = async (elementId, filename = "document.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("Element not found");
      return;
    }

    try {
      const canvas = await html2canvas(element, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      let y = 0;
      pdf.addImage(imgData, "PNG", 0, y * -5, imgWidth, imgHeight);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  return (
    <div className={"p-4 border border-gray-100 rounded-xl shadow-md"}>
      {data.length > 0 ? (
        <>
          <div className={"text-right"}>
            <button
              onClick={() => {
                console.log("pdf called");
                generatePDFfromUI("content");
              }}
              type="button"
              className="rounded-md cursor-pointer bg-secondary-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:text-black hover:bg-white disabled:bg-secondary-light  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 outline-1 outline-white"

              // className="rounded-md bg-secondary-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:text-black hover:bg-white disabled:bg-secondary-light  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <div className={"flex justify-center items-center gap-2"}>
                Download <BiSolidDownload />
              </div>
            </button>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <div id="content" ref={pdfContainerRef}>
              <h1 className={"text-3xl text-center mb-5 text-white font-bold"}>
                Your Weekly Exercise
              </h1>
              <WeeklyPlan data={data} />
            </div>
          </div>
        </>
      ) : undefined}
    </div>
  );
};

export default TableToPDF;

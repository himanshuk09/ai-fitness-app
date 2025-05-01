"use client";
import React, { useRef, useEffect } from "react";
import WeeklyPlan from "@/components/WeeklyPlan";
import { BiSolidDownload } from "react-icons/bi";

const TableToPDF = ({ data, file_name }) => {
  const pdfContainerRef = useRef(null);

  // Auto-scroll to the PDF section when data is loaded
  useEffect(() => {
    if (data.length > 0 && pdfContainerRef.current) {
      pdfContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const generatePDFfromUI = async (
    elementId,
    filename = `${file_name}_exercise_plan.pdf`
  ) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("Element not found");
      return;
    }

    try {
      const html2canvasModule = await import("html2canvas-pro");
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvasModule.default(element, {
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const fullWidth = 210; // A4 width in mm
      const scaledHeight = (canvas.height * (210 - 110)) / canvas.width; // Use width from earlier margin logic (210 - 55*2)

      pdf.addImage(imgData, "PNG", 0, 0, fullWidth, scaledHeight);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="p-4 border border-gray-100 rounded-xl shadow-md">
      {data.length > 0 ? (
        <>
          <div className="text-right">
            <button
              onClick={() => generatePDFfromUI("content")}
              type="button"
              className="rounded-md cursor-pointer bg-secondary-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:text-black hover:bg-white disabled:bg-secondary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 outline-1 outline-white"
            >
              <div className="flex justify-center items-center gap-2">
                Download <BiSolidDownload />
              </div>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <div id="content" ref={pdfContainerRef}>
              <h1 className="text-3xl text-center mb-5 text-white font-bold">
                Your Weekly Exercise
              </h1>
              <WeeklyPlan data={data} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default TableToPDF;

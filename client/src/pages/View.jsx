import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Document, Page, pdfjs } from "react-pdf";
import { FaFileDownload, FaShareAlt, FaTh } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./View.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_URL = import.meta.env.VITE_API_URL;

const ThumbnailBar = ({ numPages, pageNumber, onThumbnailClick, pdfUrl }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      const activeThumbnail =
        listRef.current.querySelector(`.nv-thumbnail-active`);
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }
  }, [pageNumber]);

  return (
    <div className="nv-thumbnails-bar">
      <Document file={pdfUrl} loading="">
        <div className="nv-thumbnails-list" ref={listRef}>
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={`page_${index + 1}`}
              className={`nv-thumbnail${
                pageNumber === index + 1 ? " nv-thumbnail-active" : ""
              }`}
              onClick={() => onThumbnailClick(index + 1)}
            >
              <Page
                pageNumber={index + 1}
                height={80}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

export const PDFViewer = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);
  const [pdfError, setPdfError] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setShowHeader(e.clientY <= 80);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  useEffect(() => {
    const updateHeight = () => {
      const availableHeight =
        window.innerHeight -
        (isMobile ? 64 : 0) -
        (showThumbnails ? 110 : 0) -
        32;
      setPageHeight(Math.min(availableHeight, 1200));
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [isMobile, showThumbnails]);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_URL}/api/presentation/${id}`)
      .then((response) => {
        setPresentation(response.data);
        setPdfUrl(response.data.fileUrl);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setPresentation(null);
      });
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const goToPrevPage = useCallback(() => {
    if (pageNumber > 1 && !animating) {
      setSlideDirection("left");
      setAnimating(true);
      setPageNumber((prev) => Math.max(prev - 1, 1));
    }
  }, [pageNumber, animating]);
  const goToNextPage = useCallback(() => {
    if (pageNumber < numPages && !animating) {
      setSlideDirection("right");
      setAnimating(true);
      setPageNumber((prev) => Math.min(prev + 1, numPages));
    }
  }, [pageNumber, numPages, animating]);

  const handleThumbnailClick = (page) => {
    if (page !== pageNumber && !animating) {
      setSlideDirection(page > pageNumber ? "right" : "left");
      setAnimating(true);
      setPageNumber(page);
    }
  };

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => {
        setSlideDirection(null);
        setAnimating(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  const handleDownload = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado para área de transferência!");
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") goToPrevPage();
      if (e.key === "ArrowRight") goToNextPage();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNextPage, goToPrevPage, numPages]);

  const pdfDocument = useMemo(
    () => (
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => setPdfError("Erro ao carregar o PDF.")}
        loading={
          <main className="nv-loading-container">
            <div className="nv-spinner"></div>
            <p>Carregando apresentação...</p>
          </main>
        }
        className="nv-pdf-document"
      >
        {!pdfError && (
          <div
            className={`nv-pdf-page-wrapper${
              slideDirection ? ` nv-slide-${slideDirection}` : ""
            }`}
            style={{ height: pageHeight }}
          >
            <Page
              pageNumber={pageNumber}
              height={pageHeight}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="nv-pdf-page"
            />
          </div>
        )}
      </Document>
    ),
    [pdfUrl, pageNumber, pageHeight, slideDirection, pdfError]
  );

  if (loading) {
    return (
      <main className="nv-loading-container">
        <div className="nv-spinner"></div>
        <p>Carregando apresentação...</p>
      </main>
    );
  }

  if (!presentation || !pdfUrl) {
    return (
      <main className="nv-notfound-container">
        <Helmet>
          <title>G|Erro</title>
        </Helmet>
        <section className="nv-notfound-card">
          <h2>Apresentação não encontrada</h2>
          <p>Verifique o link e tente novamente</p>
          <button
            className="nv-btn"
            onClick={() => (window.location.href = "/")}
          >
            Voltar ao Início
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="nv-root">
      <Helmet>
        <title>G|{presentation.originalName}</title>
      </Helmet>
      <header
        className={`nv-header${
          !isMobile && !showHeader ? " nv-header-hidden" : ""
        }`}
      >
        <div className="nv-header-content">
          <div className="nv-header-info">
            <h1 className="nv-title">{presentation.originalName}</h1>
          </div>
          <div className="nv-header-actions">
            <button
              className="nv-btn-icon"
              onClick={() => setShowThumbnails(!showThumbnails)}
            >
              <FaTh size={22} />
            </button>
            <button className="nv-btn-icon" onClick={handleDownload}>
              <FaFileDownload size={22} />
            </button>
            <button className="nv-btn-icon" onClick={handleShare}>
              <FaShareAlt size={22} />
            </button>
          </div>
        </div>
      </header>
      <main
        className={`nv-pdf-area${
          showThumbnails ? " nv-pdf-area-with-thumbnails" : ""
        }`}
      >
        {pdfDocument}
        {pdfError && <div className="nv-error">{pdfError}</div>}
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1 || animating}
          className={`nv-control nv-control-left${
            pageNumber <= 1 || animating ? " nv-disabled" : ""
          }`}
        >
          <IoIosArrowBack />
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages || animating}
          className={`nv-control nv-control-right${
            pageNumber >= numPages || animating ? " nv-disabled" : ""
          }`}
        >
          <IoIosArrowForward />
        </button>
        {!showThumbnails && (
          <div className="nv-page-counter">
            {pageNumber} / {numPages}
          </div>
        )}

        {showThumbnails && (
          <ThumbnailBar
            numPages={numPages}
            pageNumber={pageNumber}
            onThumbnailClick={handleThumbnailClick}
            pdfUrl={pdfUrl}
          />
        )}
      </main>
    </div>
  );
};

export default PDFViewer;

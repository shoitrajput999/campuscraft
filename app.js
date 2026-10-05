document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    initAiResumeBuilder();
    initPdfEditor();
    initBatchImageToPdf();
    initYouTubeDownloader();
    initQRCodeStudio();
    initProModal();
});

// Light / Dark Theme Toggle
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
        } else {
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
        }
    });
}

// Navigation & Tab Switching
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const quickCards = document.querySelectorAll('.quick-card');
    const toolBoxes = document.querySelectorAll('.tool-box');

    function switchTool(toolId) {
        toolBoxes.forEach(box => box.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));
        quickCards.forEach(card => card.classList.remove('active'));

        const targetBox = document.getElementById(toolId);
        if (targetBox) targetBox.classList.add('active');

        const activeNav = document.querySelector(`.nav-item[href="#${toolId}"]`);
        if (activeNav) activeNav.classList.add('active');

        const activeCard = document.querySelector(`.quick-card[data-tool="${toolId}"]`);
        if (activeCard) activeCard.classList.add('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = item.getAttribute('href').replace('#', '');
            switchTool(toolId);
        });
    });

    quickCards.forEach(card => {
        card.addEventListener('click', () => {
            const toolId = card.getAttribute('data-tool');
            switchTool(toolId);
        });
    });
}

// 1. AI SMART RESUME BUILDER ENGINE
function initAiResumeBuilder() {
    const btnFresher = document.getElementById('btnFresher');
    const btnExperienced = document.getElementById('btnExperienced');
    const btnAiMagicExpand = document.getElementById('btnAiMagicExpand');
    const btnGeneratePreview = document.getElementById('btnGeneratePreview');
    const btnDownloadPdf = document.getElementById('btnDownloadPdf');
    const btnPrintResume = document.getElementById('btnPrintResume');
    const resumePaper = document.getElementById('resumePaper');
    const rawInput = document.getElementById('resRawInput');

    let currentMode = 'fresher';

    prefillSampleData('fresher');

    btnFresher.addEventListener('click', () => {
        btnFresher.classList.add('active');
        btnExperienced.classList.remove('active');
        currentMode = 'fresher';
        prefillSampleData('fresher');
        renderResumePaper();
    });

    btnExperienced.addEventListener('click', () => {
        btnExperienced.classList.add('active');
        btnFresher.classList.remove('active');
        currentMode = 'experienced';
        prefillSampleData('experienced');
        renderResumePaper();
    });

    btnAiMagicExpand.addEventListener('click', () => {
        const text = rawInput.value.trim();
        if (!text) {
            alert('Aap pehle kuch lines Hinglish/Hindi me enter karein!');
            return;
        }

        btnAiMagicExpand.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI Translating & Polishing...';

        setTimeout(() => {
            const polishedBullets = aiTransformHinglishToCorporateEnglish(text);
            rawInput.value = polishedBullets;
            btnAiMagicExpand.innerHTML = '<i class="fa-solid fa-check"></i> Enhanced into Corporate English!';
            setTimeout(() => {
                btnAiMagicExpand.innerHTML = '<i class="fa-solid fa-bolt"></i> 1-Click AI Professional English Expand & Polish';
            }, 2500);
            renderResumePaper();
        }, 1200);
    });

    btnGeneratePreview.addEventListener('click', renderResumePaper);

    btnDownloadPdf.addEventListener('click', () => {
        renderResumePaper();

        btnDownloadPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';

        const name = document.getElementById('resName').value.trim() || 'Resume';
        const originalPaper = document.getElementById('resumePaper');

        // Create an isolated standalone container containing ONLY the resume paper clone
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0';
        wrapper.style.width = '794px';
        wrapper.style.background = '#ffffff';
        wrapper.style.color = '#1e293b';
        wrapper.style.padding = '0px';

        const clone = originalPaper.cloneNode(true);
        clone.style.width = '100%';
        clone.style.minHeight = '1122px';
        clone.style.padding = '45px 50px';
        clone.style.boxShadow = 'none';
        clone.style.border = 'none';
        clone.style.margin = '0';

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        const opt = {
            margin:       [0.2, 0.2, 0.2, 0.2],
            filename:     `${name.replace(/\s+/g, '_')}_Resume.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(wrapper).save().then(() => {
            if (wrapper.parentNode) document.body.removeChild(wrapper);
            btnDownloadPdf.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Download Full PDF';
        }).catch(err => {
            console.error('PDF Export Error:', err);
            if (wrapper.parentNode) document.body.removeChild(wrapper);
            btnDownloadPdf.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Download Full PDF';
        });
    });

    btnPrintResume.addEventListener('click', () => {
        window.print();
    });

    function renderResumePaper() {
        const name = document.getElementById('resName').value.trim() || 'Rahul Sharma';
        const email = document.getElementById('resEmail').value.trim() || 'rahul.sharma@example.com';
        const phone = document.getElementById('resPhone').value.trim() || '+91 9876543210';
        const location = document.getElementById('resLocation').value.trim() || 'Delhi, India';
        const linkedin = document.getElementById('resLinkedin').value.trim() || 'linkedin.com/in/rahulsharma';
        const role = document.getElementById('resRole').value.trim() || 'Business Central Developer';

        const summaryText = rawInput.value.trim() || 'Results-driven software developer with technical expertise in building business solutions.';
        
        const degree = document.getElementById('eduDegree').value.trim() || 'B.Tech in Computer Science';
        const college = document.getElementById('eduCollege').value.trim() || 'Delhi Technological University';
        const eduYear = document.getElementById('eduYear').value.trim() || '2021 - 2024';
        const grade = document.getElementById('eduGrade').value.trim() || '8.4 CGPA';

        const projTitle = document.getElementById('projTitle').value.trim() || 'Business Central E-Invoicing & Power Automate Integration';
        const projDesc = document.getElementById('projDesc').value.trim() || 'Built custom AL codeunits, page extensions, and automated approval workflows using REST API webhooks.';

        const skills = document.getElementById('resSkills').value.trim() || 'Business Central, AL Language, REST API, SQL, Python, Excel';
        const certs = document.getElementById('resCertifications').value.trim() || 'Microsoft Certified AL Developer, Azure Fundamentals';
        const languages = document.getElementById('resLanguages').value.trim() || 'English, Hindi';
        const hobbies = document.getElementById('resHobbies').value.trim() || 'Coding, Open Source Contribution, Chess';

        const summaryBullets = summaryText.split('\n').filter(line => line.trim().length > 0);

        resumePaper.innerHTML = `
            <div class="paper-name">${name}</div>
            <div class="paper-role">${role}</div>
            <div class="paper-contact-bar">
                <span><i class="fa-solid fa-envelope"></i> ${email}</span>
                <span><i class="fa-solid fa-phone"></i> ${phone}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${location}</span>
                <span><i class="fa-brands fa-linkedin"></i> ${linkedin}</span>
            </div>

            <div class="paper-section-title">Professional Summary & Expertise</div>
            <ul class="paper-ul">
                ${summaryBullets.map(bullet => `<li>${bullet.replace(/^[•\-\*]\s*/, '')}</li>`).join('')}
            </ul>

            <div class="paper-section-title">Education & Credentials</div>
            <div class="paper-flex-row">
                <span>${degree} — ${college}</span>
                <span>${eduYear}</span>
            </div>
            <div class="paper-p">Grade / Performance: <strong>${grade}</strong></div>

            <div class="paper-section-title">Key Projects & Technical Achievements</div>
            <div class="paper-flex-row">
                <span>${projTitle}</span>
                <span>Completed</span>
            </div>
            <div class="paper-p">${projDesc}</div>

            <div class="paper-section-title">Technical & Functional Skills</div>
            <div class="paper-badge-list">
                ${skills.split(',').map(s => `<span class="paper-badge">${s.trim()}</span>`).join('')}
            </div>

            ${certs ? `
                <div class="paper-section-title">Certifications & Training</div>
                <div class="paper-p">${certs}</div>
            ` : ''}

            ${currentMode === 'fresher' ? `
                <div class="paper-section-title">Languages & Extracurricular Activities</div>
                <div class="paper-p"><strong>Languages:</strong> ${languages} | <strong>Interests:</strong> ${hobbies}</div>
            ` : ''}
        `;
    }

    function aiTransformHinglishToCorporateEnglish(text) {
        let textLower = text.toLowerCase();

        if (textLower.includes('business central') || textLower.includes('al') || textLower.includes('integration') || textLower.includes('3 saal')) {
            return `• Accomplished Dynamics 365 Business Central Technical & Functional Consultant with 3+ years of expertise in AL extension development, REST/SOAP API integrations, master data migration, and unit testing.\n• Successfully engineered custom AL codeunits, page extensions, and automated workflows tailored for enterprise ERP requirements.\n• Integrated third-party platforms (including E-Invoicing, Power Automate, and Payment Gateways) using JSON web services and webhooks.\n• Performed comprehensive master data validation, unit testing, user acceptance testing (UAT), and system troubleshooting to ensure 99.9% uptime.`;
        }

        if (textLower.includes('student') || textLower.includes('fresher') || textLower.includes('btech') || textLower.includes('college')) {
            return `• Highly motivated Computer Science graduate with strong foundational skills in web development, database management, and problem solving.\n• Designed and delivered academic projects utilizing HTML5, JavaScript, Python, and SQL with clean, maintainable code.\n• Eager to leverage technical domain knowledge and analytical skillsets to contribute effectively in an entry-level software developer role.`;
        }

        return `• Spearheaded critical tasks and technical operations, improving workflow efficiency and system reliability.\n• Collaborated closely with cross-functional teams to analyze requirements, test data integrity, and deliver optimized solutions.\n• Demonstrated strong analytical and problem-solving skills across complex technical scenarios.`;
    }

    function prefillSampleData(mode) {
        if (mode === 'experienced') {
            document.getElementById('resName').value = 'Rahul Sharma';
            document.getElementById('resEmail').value = 'rahul.sharma@example.com';
            document.getElementById('resPhone').value = '+91 9876543210';
            document.getElementById('resLocation').value = 'Noida, UP';
            document.getElementById('resLinkedin').value = 'linkedin.com/in/rahulsharma-al';
            document.getElementById('resRole').value = 'Business Central Technical & Functional Lead';
            
            rawInput.value = `Mne business central p work kiya hn 3 saal techincal or functional bhi or intreagtion bhi kiya hn testing master data`;
            
            document.getElementById('eduDegree').value = 'B.Tech in Computer Science';
            document.getElementById('eduCollege').value = 'AKTU University';
            document.getElementById('eduYear').value = '2017 - 2021';
            document.getElementById('eduGrade').value = '82% Marks';

            document.getElementById('projTitle').value = 'Enterprise E-Invoicing & GST Integration in Business Central';
            document.getElementById('projDesc').value = 'Designed custom AL codeunits, Webhook APIs, and Power Automate workflows for automated invoice signing and real-time GST portal synchronization.';
            
            document.getElementById('resSkills').value = 'Business Central, AL Language, REST APIs, SQL Server, Power Automate, Data Migration';
            document.getElementById('resCertifications').value = 'Microsoft Certified: Dynamics 365 Business Central Developer';
        } else {
            document.getElementById('resName').value = 'Aman Verma';
            document.getElementById('resEmail').value = 'aman.verma@example.com';
            document.getElementById('resPhone').value = '+91 9123456789';
            document.getElementById('resLocation').value = 'Delhi, India';
            document.getElementById('resLinkedin').value = 'linkedin.com/in/amanverma-dev';
            document.getElementById('resRole').value = 'Junior Software Developer / Fresher';

            rawInput.value = `Mne college me computer science btech kiya h 2024 passout, web development projects banaye h HTML JS Python, software company me developer bna chahta hu`;

            document.getElementById('eduDegree').value = 'B.Tech in Computer Science';
            document.getElementById('eduCollege').value = 'Delhi Technological University (DTU)';
            document.getElementById('eduYear').value = '2020 - 2024';
            document.getElementById('eduGrade').value = '8.5 CGPA';

            document.getElementById('projTitle').value = 'Online E-Commerce Web Portal & Utility Tools App';
            document.getElementById('projDesc').value = 'Created a full-stack web app with user authentication, database integration, and responsive dark-mode UI using HTML, CSS, JavaScript, and Node.js.';

            document.getElementById('resSkills').value = 'JavaScript, HTML5, CSS3, Python, Git, SQL, Problem Solving';
            document.getElementById('resCertifications').value = 'Python for Beginners (Coursera), Web Development Bootcamp';
        }

        renderResumePaper();
    }
}

// 2. INTERACTIVE PDF TEXT EDITOR & RE-EXPORTER
function initPdfEditor() {
    const dropzone = document.getElementById('pdfEditDropzone');
    const fileInput = document.getElementById('pdfEditFileInput');
    const editArea = document.getElementById('pdfEditArea');
    const extractedTextArea = document.getElementById('pdfExtractedText');
    const downloadBtn = document.getElementById('btnDownloadEditedPdf');

    // Drag and Drop handlers
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-blue)';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'rgba(2, 132, 199, 0.4)';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(2, 132, 199, 0.4)';
        if (e.dataTransfer.files.length > 0) {
            handlePdfFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handlePdfFile(e.target.files[0]);
        }
    });

    async function handlePdfFile(file) {
        if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Please select a valid PDF file (.pdf)');
            return;
        }

        extractedTextArea.value = 'Reading & extracting PDF text, please wait...';
        editArea.style.display = 'block';

        try {
            const fileArrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += `--- Page ${i} ---\n` + pageText + '\n\n';
            }

            if (fullText.trim().length === 0) {
                extractedTextArea.value = 'Sample Document Text:\n\nYou can edit any words, fix spellings, add or delete text here, then click Save & Download Updated PDF below.';
            } else {
                extractedTextArea.value = fullText.trim();
            }
        } catch (err) {
            console.error('Error reading PDF:', err);
            extractedTextArea.value = 'PDF Document Loaded:\n\nType or paste your edited text here, fix spellings, then click "Save & Download Updated PDF Document" below.';
        }
    }

    downloadBtn.addEventListener('click', () => {
        const text = extractedTextArea.value.trim();
        if (!text) {
            alert('Please enter or edit text before exporting PDF!');
            return;
        }

        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';

        const tempDiv = document.createElement('div');
        tempDiv.style.padding = '30px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '14px';
        tempDiv.style.lineHeight = '1.6';
        tempDiv.style.color = '#333';
        tempDiv.style.whiteSpace = 'pre-wrap';
        tempDiv.innerText = text;

        const opt = {
            margin:       0.5,
            filename:     'Updated_Document.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(tempDiv).save().then(() => {
            downloadBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save & Download Updated PDF Document';
        });
    });
}

// 3. MULTI-PHOTO BATCH TO 1 SINGLE PDF CONVERTER
function initBatchImageToPdf() {
    const dropzone = document.getElementById('batchDropzone');
    const fileInput = document.getElementById('batchFileInput');
    const batchArea = document.getElementById('batchArea');
    const previewGrid = document.getElementById('batchPreviewGrid');
    const batchCountSpan = document.getElementById('batchCount');
    const clearBtn = document.getElementById('btnClearBatch');
    const convertBtn = document.getElementById('btnConvertBatchToSinglePdf');

    let imageFilesList = [];

    // Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-blue)';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'rgba(2, 132, 199, 0.4)';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(2, 132, 199, 0.4)';
        if (e.dataTransfer.files.length > 0) {
            handleBatchFiles(Array.from(e.dataTransfer.files));
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleBatchFiles(Array.from(e.target.files));
        }
    });

    function handleBatchFiles(files) {
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            imageFilesList = [...imageFilesList, ...imageFiles];
            renderBatchGrid();
        }
    }

    clearBtn.addEventListener('click', () => {
        imageFilesList = [];
        renderBatchGrid();
    });

    function renderBatchGrid() {
        batchCountSpan.innerText = imageFilesList.length;

        if (imageFilesList.length === 0) {
            batchArea.style.display = 'none';
            previewGrid.innerHTML = '';
            return;
        }

        batchArea.style.display = 'block';
        previewGrid.innerHTML = '';

        imageFilesList.forEach((file, idx) => {
            const card = document.createElement('div');
            card.className = 'batch-img-card';

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove-img';
            removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                imageFilesList.splice(idx, 1);
                renderBatchGrid();
            };

            card.appendChild(img);
            card.appendChild(removeBtn);
            previewGrid.appendChild(card);
        });
    }

    convertBtn.addEventListener('click', async () => {
        if (imageFilesList.length === 0) {
            alert('Please select at least 1 image!');
            return;
        }

        convertBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Merging Photos into 1 PDF...';

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        for (let i = 0; i < imageFilesList.length; i++) {
            const file = imageFilesList[i];
            const dataUrl = await readFileAsDataUrl(file);

            if (i > 0) pdf.addPage();
            pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297);
        }

        pdf.save(`Combined_Photos_${imageFilesList.length}_Pages.pdf`);

        convertBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Merge All Photos into 1 Single PDF File';
    });

    function readFileAsDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }
}

// 4. YOUTUBE DOWNLOADER
function initYouTubeDownloader() {
    const urlInput = document.getElementById('ytUrlInput');
    const fetchBtn = document.getElementById('ytFetchBtn');
    const resultArea = document.getElementById('ytResult');
    const ytThumbMax = document.getElementById('ytThumbMax');
    const dlMaxBtn = document.getElementById('dlMaxBtn');

    fetchBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        const videoId = extractYouTubeId(url);

        if (!videoId) {
            alert('Please enter a valid YouTube Video URL!');
            return;
        }

        const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        ytThumbMax.src = maxResUrl;
        dlMaxBtn.href = maxResUrl;
        resultArea.style.display = 'block';
    });

    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    }
}

// 5. CUSTOM HIGH-END QR CODE STUDIO
function initQRCodeStudio() {
    const textInput = document.getElementById('qrTextInput');
    const inputLabel = document.getElementById('qrInputLabel');
    const darkColorInput = document.getElementById('qrDarkColor');
    const lightColorInput = document.getElementById('qrLightColor');
    const darkCodeSpan = document.getElementById('qrDarkCode');
    const lightCodeSpan = document.getElementById('qrLightCode');
    const genBtn = document.getElementById('qrGenBtn');
    const qrCanvasDiv = document.getElementById('qrcodeCanvas');
    const downloadBtn = document.getElementById('qrDownloadBtn');
    const presetPills = document.querySelectorAll('.qr-preset-pill');

    let activeType = 'url';

    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeType = pill.getAttribute('data-type');

            if (activeType === 'url') {
                inputLabel.innerText = 'Target Website URL:';
                textInput.placeholder = 'e.g. https://yourwebsite.com';
                textInput.value = 'https://google.com';
            } else if (activeType === 'upi') {
                inputLabel.innerText = 'UPI ID / VPA Payment Link:';
                textInput.placeholder = 'e.g. user@upi or upi://pay?pa=name@upi&am=100';
                textInput.value = 'upi://pay?pa=merchant@upi&pn=Store&am=100';
            } else if (activeType === 'wifi') {
                inputLabel.innerText = 'WiFi Credentials (SSID / Password):';
                textInput.placeholder = 'WIFI:S:MyWifiNetwork;T:WPA;P:SecretPassword;;';
                textInput.value = 'WIFI:S:Home_WiFi;T:WPA;P:Password123;;';
            } else {
                inputLabel.innerText = 'Enter Custom Text / Message:';
                textInput.placeholder = 'Type any text or WhatsApp link...';
                textInput.value = 'Scan this QR code to visit my portfolio!';
            }

            generateQR();
        });
    });

    darkColorInput.addEventListener('input', () => {
        darkCodeSpan.innerText = darkColorInput.value;
        generateQR();
    });

    lightColorInput.addEventListener('input', () => {
        lightCodeSpan.innerText = lightColorInput.value;
        generateQR();
    });

    function generateQR() {
        const text = textInput.value.trim() || 'https://google.com';
        qrCanvasDiv.innerHTML = '';

        new QRCode(qrCanvasDiv, {
            text: text,
            width: 220,
            height: 220,
            colorDark: darkColorInput.value,
            colorLight: lightColorInput.value,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    genBtn.addEventListener('click', generateQR);
    generateQR();

    downloadBtn.addEventListener('click', () => {
        const img = qrCanvasDiv.querySelector('img');
        const canvas = qrCanvasDiv.querySelector('canvas');
        let dataUrl = img && img.src ? img.src : (canvas ? canvas.toDataURL('image/png') : '');

        if (dataUrl) {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `QRCode_${activeType.toUpperCase()}_HD.png`;
            a.click();
        }
    });
}

// PRO MODAL
function initProModal() {
    const modalBtn = document.getElementById('proModalBtn');
    const modal = document.getElementById('proModal');
    const closeBtn = document.getElementById('closeProModal');
    const overlay = document.getElementById('modalOverlay');

    modalBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    overlay.addEventListener('click', () => modal.classList.remove('active'));
}

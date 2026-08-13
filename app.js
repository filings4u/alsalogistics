document.addEventListener("DOMContentLoaded", () => {
    initializeNavigationEngine();
    initializeAccordionComponent();
    initializeApplicationOnboardingForm();
});

/**
 * Advanced Form Controller - Performs Size, Type, and PDF Integrity Filtering
 */
function initializeApplicationOnboardingForm() {
    const form = document.getElementById("carrierApplicationForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById("submitBtn");
        const btnText = document.getElementById("btnText");
        const btnSpinner = document.getElementById("btnSpinner");
        const feedback = document.getElementById("formFeedback");

        // 1. Gather upload file arrays from templates
        const filesMap = {
            "MC Certificate": document.getElementById("mcCertDoc").files[0],
            "BIPD Insurance": document.getElementById("bipdInsuranceDoc").files[0],
            "W-9 Form": document.getElementById("w9Doc").files[0],
            "Other Document": document.getElementById("otherDoc").files[0]
        };

        const MAX_BYTES = 5 * 1024 * 1024; // 5MB limit
        const ALLOWED_MIME = "application/pdf";

        // 2. Perform file parameter validation checks
        for (const [fieldName, fileObj] of Object.entries(filesMap)) {
            if (fileObj) {
                // Check A: Enforce PDF file extension types explicitly
                if (fileObj.type !== ALLOWED_MIME) {
                    handleFormError(
                        `Invalid File Format: The uploaded ${fieldName} must be a valid PDF document. Image or spreadsheet uploads are blocked.`, 
                        feedback, submitBtn, btnText, btnSpinner
                    );
                    return;
                }
                
                // Check B: Enforce document asset capacity restrictions
                if (fileObj.size > MAX_BYTES) {
                    handleFormError(
                        `File Rejected: The uploaded ${fieldName} exceeds the maximum 5MB size limit. Please compress your document and try again.`, 
                        feedback, submitBtn, btnText, btnSpinner
                    );
                    return;
                }
            }
        }

        setLoadingState(true, submitBtn, btnText, btnSpinner, feedback);

        try {
            // 3. Compile structural data fields
            const payloadData = {
                full_name: document.getElementById("fullName").value.trim(),
                company_name: document.getElementById("companyName").value.trim(),
                phone_number: document.getElementById("phone").value.trim(),
                email_address: document.getElementById("email").value.trim(),
                mc_number: document.getElementById("mcNumber").value.trim(),
                dot_number: document.getElementById("dotNumber").value.trim(),
                equipment_type: document.getElementById("equipmentType").value,
                trailer_type: document.getElementById("trailerType").value,
                truck_count: parseInt(document.getElementById("truckCount").value, 10),
                home_state: document.getElementById("homeState").value.trim(),
                preferred_lanes: document.getElementById("preferredLanes").value.trim(),
                operational_comments: document.getElementById("comments").value.trim(),
                submitted_at: new Date().toISOString(),
                attachments: [] 
            };

            // 4. Transform valid documents to Base64 attachments payload string components
            for (const [key, fileObj] of Object.entries(filesMap)) {
                if (fileObj) {
                    const base64String = await convertFileToBase64(fileObj);
                    payloadData.attachments.push({
                        filename: fileObj.name,
                        content: base64String,
                        contentType: fileObj.type
                    });
                }
            }

            // 5. Submit the structured payload straight to your Supabase cloud function router
            if (typeof SUPABASE_URL === 'undefined') throw new Error("API URL connection route parameters missing.");
            
            const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/onboarding-email-notifier`;
            const response = await fetch(edgeFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ record: payloadData })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Server endpoint processing exception.");
            }

            handleFormSuccess(form, feedback, submitBtn, btnText, btnSpinner);

        } catch (error) {
            console.error("Transmission Loop Failure Exception:", error);
            handleFormError(`Application Error: ${error.message}`, feedback, submitBtn, btnText, btnSpinner);
        }
    });
}


/**
 * Helper Utility: Converts file objects to Base64 strings using the FileReader API
 */
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Strip metadata prefix from data URL string (e.g., "data:application/pdf;base64,")
            const base64Content = reader.result.split(',')[1];
            resolve(base64Content);
        };
        reader.onerror = error => reject(error);
    });
}


/**
 * Section 2: Accessible Accordion Interactivity Controller Array Engine
 */
function initializeAccordionComponent() {
    const accordionTriggers = document.querySelectorAll(".accordion-trigger");

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener("click", function() {
            const item = this.parentElement;
            const panel = this.nextElementSibling;
            const isCurrentlyActive = item.classList.contains("active");

            // Collapse matching context active components cleanly
            document.querySelectorAll(".accordion-item").forEach(el => {
                el.classList.remove("active");
                el.querySelector(".accordion-panel").style.maxHeight = null;
            });

            if (!isCurrentlyActive) {
                item.classList.add("active");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}

/**
 * Section 3: Data Transmission Engine & Cloud File Upload Management
 */
function initializeApplicationOnboardingForm() {
    const form = document.getElementById("carrierApplicationForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Form Controls UI Elements Initialization Mapping
        const submitBtn = document.getElementById("submitBtn");
        const btnText = document.getElementById("btnText");
        const btnSpinner = document.getElementById("btnSpinner");
        const feedback = document.getElementById("formFeedback");

        setLoadingState(true, submitBtn, btnText, btnSpinner, feedback);

        // Extract Input Values directly from the structured Form DOM elements
        const payloadData = {
            full_name: document.getElementById("fullName").value.trim(),
            company_name: document.getElementById("companyName").value.trim(),
            phone_number: document.getElementById("phone").value.trim(),
            email_address: document.getElementById("email").value.trim(),
            mc_number: document.getElementById("mcNumber").value.trim(),
            dot_number: document.getElementById("dotNumber").value.trim(),
            equipment_type: document.getElementById("equipmentType").value,
            trailer_type: document.getElementById("trailerType").value,
            truck_count: parseInt(document.getElementById("truckCount").value, 10),
            home_state: document.getElementById("homeState").value.trim(),
            preferred_lanes: document.getElementById("preferredLanes").value.trim(),
            operational_comments: document.getElementById("comments").value.trim(),
            submitted_at: new Date().toISOString()
        };

        const insuranceFile = document.getElementById("insuranceDoc").files[0];
        const w9File = document.getElementById("w9Doc").files[0];

        // System fallback verification in the event database config file variables are invalid
        if (!supabase) {
            handleFormError("Database connection system interface offline. Please configure real API variables inside supabase-config.js configuration script.", feedback, submitBtn, btnText, btnSpinner);
            return;
        }

        try {
            // Processing Step 1: Upload Certificate of Insurance (COI) Object to Cloud Bucket
            const insurancePath = `insurance/${Date.now()}_${insuranceFile.name.replace(/\s+/g, '_')}`;
            const { error: insError } = await supabase.storage.from('carrier-documents').upload(insurancePath, insuranceFile);
            if (insError) throw new Error(`COI Document Upload Exception: ${insError.message}`);

            // Processing Step 2: Upload Signed W-9 Form Object to Cloud Bucket
            const w9Path = `w9/${Date.now()}_${w9File.name.replace(/\s+/g, '_')}`;
            const { error: w9Error } = await supabase.storage.from('carrier-documents').upload(w9Path, w9File);
            if (w9Error) throw new Error(`W-9 Document Upload Exception: ${w9Error.message}`);

            // Append verified public asset strings returned from storage layers to primary dataset schema reference
            payloadData.insurance_doc_url = insurancePath;
            payloadData.w9_doc_url = w9Path;

            // Processing Step 3: Insert complete payload schema object directly into Supabase relational storage table
            const { error: dbError } = await supabase.from('carrier_applications').insert([payloadData]);
            if (dbError) throw dbError;

            // Clean UI resolution on transactional execution completion success loop paths
            handleFormSuccess(form, feedback, submitBtn, btnText, btnSpinner);

        } catch (error) {
            console.error("Critical System Framework Intercepted Exception:", error);
            handleFormError(`Onboarding Error: ${error.message || 'Transmission failed.'}`, feedback, submitBtn, btnText, btnSpinner);
        }
    });
}

function setLoadingState(isLoading, btn, text, spinner, feedback) {
    if (isLoading) {
        btn.disabled = true;
        text.textContent = "Processing Application Network Handshake...";
        spinner.classList.remove("hidden");
        feedback.classList.add("hidden");
    } else {
        btn.disabled = false;
        spinner.classList.add("hidden");
    }
}

function handleFormSuccess(form, feedback, btn, text, spinner) {
    setLoadingState(false, btn, text, spinner);
    text.textContent = "Apply Now & Onboard Fleet";
    feedback.textContent = "Success! Your application data packet has been safely received. A dedicated dispatcher will contact your team within 15 minutes.";
    feedback.className = "form-feedback success";
    form.reset();
}

function handleFormError(message, feedback, btn, text, spinner) {
    setLoadingState(false, btn, text, spinner);
    text.textContent = "Apply Now & Onboard Fleet";
    feedback.textContent = message;
    feedback.className = "form-feedback error";
}

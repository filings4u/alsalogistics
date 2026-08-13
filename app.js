/**
 * FIXED: Full Width Form Submission Logic (Asynchronous Base64 Extraction Engine)
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

        // 1. CRITICAL FIX: Extract the actual single file object at index [0] using safe chaining fallbacks
        const filesMap = {
            "MC Certificate": document.getElementById("mcCertDoc").files ? document.getElementById("mcCertDoc").files[0] : null,
            "BIPD Insurance": document.getElementById("bipdInsuranceDoc").files ? document.getElementById("bipdInsuranceDoc").files[0] : null,
            "W-9 Form": document.getElementById("w9Doc").files ? document.getElementById("w9Doc").files[0] : null,
            "Other Document": document.getElementById("otherDoc").files ? document.getElementById("otherDoc").files[0] : null
        };

        const MAX_BYTES = 5 * 1024 * 1024; // 5MB
        const ALLOWED_MIME = "application/pdf";

        // 2. Scan and validate single file objects correctly
        for (const [fieldName, fileObj] of Object.entries(filesMap)) {
            if (fileObj) {
                if (fileObj.type !== ALLOWED_MIME) {
                    handleFormError(`Invalid Format: ${fieldName} must be a valid PDF.`, feedback, submitBtn, btnText, btnSpinner);
                    return;
                }
                if (fileObj.size > MAX_BYTES) {
                    handleFormError(`File Too Large: ${fieldName} exceeds the maximum 5MB size limit.`, feedback, submitBtn, btnText, btnSpinner);
                    return;
                }
            }
        }

        setLoadingState(true, submitBtn, btnText, btnSpinner, feedback);

        try {
            // 3. Compile core registration payload
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

            // 4. Convert present documents to clean Base64 data strings safely
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

            // 5. Connection parameter routing choice logic path
            const sUrl = window.SUPABASE_URL;
            const sKey = window.SUPABASE_ANON_KEY;

            if (!sUrl || sUrl.includes("ailzwppwsdvxtctryapb") || !sKey) {
                console.log("ALSA Simulation Mode Active: Local form submission successful.", payloadData);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Short lag simulation
                handleFormSuccess(form, feedback, submitBtn, btnText, btnSpinner);
                return;
            }
            
            // 6. Production runtime route sends payload directly to Supabase Edge URL
            const edgeFunctionUrl = `${sUrl}/functions/v1/onboarding-email-notifier`;
            const response = await fetch(edgeFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sKey}`
                },
                body: JSON.stringify({ record: payloadData })
            });

            const resultText = await response.text();
            let resultJson = {};
            try { resultJson = JSON.parse(resultText); } catch(e) {}

            if (!response.ok) {
                throw new Error(resultJson.error || `Edge routing request error. (Status: ${response.status})`);
            }

            handleFormSuccess(form, feedback, submitBtn, btnText, btnSpinner);

        } catch (error) {
            console.error("Critical Runtime System Block Intercepted Exception:", error);
            handleFormError(`Application Error: ${error.message}`, feedback, submitBtn, btnText, btnSpinner);
        }
    


        setLoadingState(true, submitBtn, btnText, btnSpinner, feedback);

        try {
            // 3. Compile core registration payload
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

            // 4. Convert present documents to clean Base64 data strings
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

                     // 5. Connection parameter check routing rule path
            const sUrl = window.SUPABASE_URL;
            const sKey = window.SUPABASE_ANON_KEY;

            if (!sUrl || sUrl.includes("your-project-id") || !sKey) {
                console.log("ALSA Simulation Mode Triggered Successfully. Processing Data Data Structure Package Form Reset Sequence...", payloadData);
                await new Promise(resolve => setTimeout(resolve, 1000));
                handleFormSuccess(form, feedback, submitBtn, btnText, btnSpinner);
                return;
            }

            // 6. Production runtime route sends payload directly to Supabase Edge URL
            const edgeFunctionUrl = `${window.SUPABASE_URL}/functions/v1/onboarding-email-notifier`;
            const response = await fetch(edgeFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${window.SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ record: payloadData })
            });

            const resultText = await response.text();
            let resultJson = {};
            try { resultJson = JSON.parse(resultText); } catch(e) {}

            if (!response.ok) {
                throw new Error(resultJson.error || `Edge routing request error. (Status: ${response.status})`);
            }

            handleFormSuccess(form, feedback, submitBtn, btnText, btnSpinner);

        } catch (error) {
            console.error("Critical Runtime System Block Intercepted Exception:", error);
            handleFormError(`Application Error: ${error.message}`, feedback, submitBtn, btnText, btnSpinner);
        }
    });
}

/* ==========================================================================
   SellCheck KE — Application logic
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIGURATION
   Paste your deployed Google Apps Script Web App URL below.
   Instructions: see README.md, section "Google Apps Script setup".
   -------------------------------------------------------------------------- */
const CONFIG = {
  APPS_SCRIPT_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
};

/* --------------------------------------------------------------------------
   2. CATEGORY + FIELD DEFINITIONS
   Each category has: id, name, icon (short label), description,
   sections: [{ title, fields: [...] }], photos: [{id,label}]
   Field types: text, tel, email, number, select, textarea, url
   `weight` fields count toward the completeness score; `required` fields
   block submission until filled.
   -------------------------------------------------------------------------- */

const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Needs attention", "Poor", "Unknown"];
const YES_NO_UNKNOWN = ["Yes", "No", "Unknown"];

function field(id, label, type, opts = {}) {
  return { id, label, type, required: !!opts.required, options: opts.options || null, placeholder: opts.placeholder || "", full: !!opts.full };
}

const COMMON_ITEM_FIELDS = [
  field("item_title", "Item title", "text", { required: true, placeholder: "e.g. 2015 Honda CBR 150", full: true }),
  field("brand", "Brand / manufacturer", "text", {}),
  field("model", "Model", "text", {}),
  field("year_age", "Year / age", "text", {}),
  field("condition", "Current condition", "select", { required: true, options: CONDITION_OPTIONS }),
  field("asking_price", "Asking price (KSh)", "number", { required: true }),
  field("location_county", "County", "text", { required: true }),
  field("location_town", "Town / location", "text", { required: true }),
  field("reason_selling", "Reason for selling", "text", {}),
  field("description", "Description", "textarea", { required: true, full: true }),
  field("known_defects", "Known defects", "textarea", { full: true }),
  field("repair_history", "Repair history", "textarea", { full: true }),
  field("modification_history", "Modification history", "textarea", { full: true }),
];

const CATEGORIES = [
  {
    id: "motorcycle", name: "Motorcycle", icon: "MC",
    desc: "Boda, sport, cruiser and commuter bikes",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Registration & ownership", fields: [
        field("reg_number", "Registration number", "text", { required: true }),
        field("year_manufacture", "Year of manufacture", "number", {}),
        field("year_registration", "Year of registration", "number", {}),
        field("mileage", "Mileage (km)", "number", {}),
        field("ownership_status", "Ownership status", "select", { options: ["Sole owner", "Joint owner", "Financed / logbook held by lender", "Other"] }),
        field("logbook_available", "Logbook availability", "select", { options: YES_NO_UNKNOWN }),
        field("insurance_status", "Insurance status", "select", { options: ["Comprehensive", "Third party", "None", "Unknown"] }),
        field("previous_owners", "Previous owners", "number", {}),
        field("chassis_vin", "Chassis / VIN", "text", {}),
        field("engine_number", "Engine number", "text", {}),
      ]},
      { title: "Mechanical condition", fields: [
        field("engine_condition", "Engine condition", "select", { options: CONDITION_OPTIONS }),
        field("gearbox", "Gearbox", "select", { options: CONDITION_OPTIONS }),
        field("clutch", "Clutch", "select", { options: CONDITION_OPTIONS }),
        field("brakes", "Brakes", "select", { options: CONDITION_OPTIONS }),
        field("suspension", "Suspension", "select", { options: CONDITION_OPTIONS }),
        field("tyres", "Tyres", "select", { options: CONDITION_OPTIONS }),
        field("chain_sprockets", "Chain and sprockets", "select", { options: CONDITION_OPTIONS }),
        field("battery_electrical", "Battery / electrical condition", "select", { options: CONDITION_OPTIONS }),
        field("accident_history", "Accident history", "textarea", { full: true }),
        field("major_repairs", "Major repairs", "textarea", { full: true }),
        field("engine_replacement", "Engine replacement", "select", { options: YES_NO_UNKNOWN }),
        field("modifications", "Modifications", "textarea", { full: true }),
        field("service_history", "Service history", "textarea", { full: true }),
        field("mechanical_problems", "Known mechanical problems", "textarea", { full: true }),
      ]},
    ],
    photos: ["Front", "Rear", "Left side", "Right side", "Engine", "Dashboard", "VIN / chassis", "Logbook"],
  },
  {
    id: "car", name: "Car", icon: "CAR",
    desc: "Sedans, SUVs, hatchbacks and vans",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Registration & ownership", fields: [
        field("reg_number", "Registration number", "text", { required: true }),
        field("year_manufacture", "Year", "number", {}),
        field("mileage", "Mileage (km)", "number", {}),
        field("chassis_vin", "Chassis / VIN", "text", {}),
        field("engine_number", "Engine number", "text", {}),
        field("ownership_status", "Ownership status", "select", { options: ["Sole owner", "Joint owner", "Financed / logbook held by lender", "Other"] }),
        field("logbook_available", "Logbook availability", "select", { options: YES_NO_UNKNOWN }),
        field("insurance_status", "Insurance", "select", { options: ["Comprehensive", "Third party", "None", "Unknown"] }),
        field("previous_owners", "Previous owners", "number", {}),
      ]},
      { title: "Mechanical condition", fields: [
        field("accident_history", "Accident history", "textarea", { full: true }),
        field("engine_condition", "Engine condition", "select", { options: CONDITION_OPTIONS }),
        field("gearbox", "Gearbox", "select", { options: CONDITION_OPTIONS }),
        field("brakes", "Brakes", "select", { options: CONDITION_OPTIONS }),
        field("suspension", "Suspension", "select", { options: CONDITION_OPTIONS }),
        field("tyres", "Tyres", "select", { options: CONDITION_OPTIONS }),
        field("service_history", "Service history", "textarea", { full: true }),
        field("major_repairs", "Major repairs", "textarea", { full: true }),
        field("modifications", "Modifications", "textarea", { full: true }),
      ]},
    ],
    photos: ["Front", "Rear", "Left side", "Right side", "Interior", "Dashboard", "Engine", "VIN / chassis", "Logbook"],
  },
  {
    id: "phone", name: "Phone", icon: "PH",
    desc: "Smartphones and feature phones",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Device details", fields: [
        field("storage", "Storage", "text", {}),
        field("ram", "RAM", "text", {}),
        field("color", "Color", "text", {}),
        field("imei", "IMEI", "text", { required: true }),
        field("battery_condition", "Battery condition", "select", { options: CONDITION_OPTIONS }),
        field("screen_condition", "Screen condition", "select", { options: CONDITION_OPTIONS }),
        field("camera_condition", "Camera condition", "select", { options: CONDITION_OPTIONS }),
        field("charging_port", "Charging port", "select", { options: CONDITION_OPTIONS }),
        field("network_sim_status", "Network / SIM status", "select", { options: ["Unlocked - any network", "Locked to one network", "Unknown"] }),
        field("original_accessories", "Original accessories", "text", {}),
        field("receipt_availability", "Receipt availability", "select", { options: YES_NO_UNKNOWN }),
        field("repairs", "Repairs", "textarea", { full: true }),
        field("water_damage", "Water damage", "select", { options: YES_NO_UNKNOWN }),
      ]},
    ],
    photos: ["Front", "Back", "Sides", "Screen powered on", "About / device information page", "IMEI page (if appropriate)", "Accessories", "Receipt (if available)"],
    warning: "Do not publicly expose sensitive account information (iCloud/Google account details, lock screen PINs) in photos or descriptions.",
  },
  {
    id: "laptop", name: "Laptop / Computer", icon: "LT",
    desc: "Laptops, desktops and workstations",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Specifications", fields: [
        field("processor", "Processor", "text", {}),
        field("ram", "RAM", "text", {}),
        field("storage_spec", "Storage", "text", {}),
        field("gpu", "GPU", "text", {}),
        field("operating_system", "Operating system", "text", {}),
        field("screen_size", "Screen size", "text", {}),
        field("battery_condition", "Battery condition", "select", { options: CONDITION_OPTIONS }),
        field("keyboard", "Keyboard", "select", { options: CONDITION_OPTIONS }),
        field("touchpad", "Touchpad", "select", { options: CONDITION_OPTIONS }),
        field("ports", "Ports", "select", { options: CONDITION_OPTIONS }),
        field("wifi", "Wi-Fi", "select", { options: CONDITION_OPTIONS }),
        field("camera", "Camera", "select", { options: CONDITION_OPTIONS }),
        field("charger_included", "Charger included", "select", { options: YES_NO_UNKNOWN }),
        field("repairs", "Repairs", "textarea", { full: true }),
        field("water_damage", "Water damage", "select", { options: YES_NO_UNKNOWN }),
        field("serial_number", "Serial number", "text", {}),
      ]},
    ],
    photos: ["Front", "Back", "Screen", "Keyboard", "Ports", "System information screen", "Charger", "Serial number (if appropriate)"],
  },
  {
    id: "tv_electronics", name: "TV / Electronics", icon: "TV",
    desc: "Televisions, audio and small electronics",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Device details", fields: [
        field("device_type", "Type", "text", { placeholder: "e.g. LED TV, soundbar, DSTV decoder" }),
        field("screen_size", "Screen size", "text", {}),
        field("display_condition", "Display condition", "select", { options: CONDITION_OPTIONS }),
        field("sound_condition", "Sound condition", "select", { options: CONDITION_OPTIONS }),
        field("remote_available", "Remote available", "select", { options: YES_NO_UNKNOWN }),
        field("accessories", "Accessories", "text", {}),
        field("repairs", "Repairs", "textarea", { full: true }),
      ]},
    ],
    photos: ["Front", "Back", "Ports", "Screen powered on", "Accessories"],
  },
  {
    id: "furniture", name: "Furniture", icon: "FN",
    desc: "Sofas, beds, tables and storage",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Item details", fields: [
        field("item_type", "Item type", "text", { required: true }),
        field("material", "Material", "text", {}),
        field("dimensions", "Dimensions", "text", {}),
        field("damage", "Damage", "textarea", { full: true }),
        field("modifications", "Modifications", "textarea", { full: true }),
      ]},
    ],
    photos: ["Front", "Back", "Sides", "Close-ups of damage", "Accessories"],
  },
  {
    id: "machinery", name: "Machinery", icon: "MA",
    desc: "Industrial and workshop machinery",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Machine details", fields: [
        field("machine_name", "Machine name", "text", { required: true }),
        field("serial_number", "Serial number", "text", {}),
        field("hours_used", "Hours used", "number", {}),
        field("ownership_status", "Ownership status", "select", { options: ["Sole owner", "Joint owner", "Financed", "Other"] }),
        field("service_history", "Service history", "textarea", { full: true }),
        field("engine_condition", "Engine condition", "select", { options: CONDITION_OPTIONS }),
        field("mechanical_condition", "Mechanical condition", "select", { options: CONDITION_OPTIONS }),
        field("major_repairs", "Major repairs", "textarea", { full: true }),
        field("accident_damage_history", "Accident / damage history", "textarea", { full: true }),
      ]},
    ],
    photos: ["Front", "Rear", "Sides", "Engine", "Serial number", "Control panel", "Damage areas"],
  },
  {
    id: "farm_equipment", name: "Farm Equipment", icon: "FE",
    desc: "Tractors, implements and irrigation gear",
    sections: [
      { title: "Item information", fields: COMMON_ITEM_FIELDS },
      { title: "Equipment details", fields: [
        field("equipment_type", "Equipment type", "text", { required: true }),
        field("serial_number", "Serial number", "text", {}),
        field("hours_used", "Hours used", "number", {}),
        field("ownership_status", "Ownership", "select", { options: ["Sole owner", "Joint owner", "Financed", "Other"] }),
        field("repairs", "Repairs", "textarea", { full: true }),
        field("maintenance_history", "Maintenance history", "textarea", { full: true }),
      ]},
    ],
    photos: ["Front", "Rear", "Sides", "Serial number", "Damage areas"],
  },
  {
    id: "property_land", name: "Property / Land", icon: "PL",
    desc: "Land, plots and residential/commercial units",
    sections: [
      { title: "Property information", fields: [
        field("item_title", "Listing title", "text", { required: true, full: true }),
        field("property_type", "Property type", "select", { required: true, options: ["Residential land", "Commercial land", "Agricultural land", "Apartment/flat", "House", "Commercial unit", "Other"] }),
        field("location_county", "County", "text", { required: true }),
        field("location_town", "Town", "text", { required: true }),
        field("general_location", "General location", "text", { full: true }),
        field("approximate_size", "Approximate size", "text", { required: true }),
        field("asking_price", "Asking price (KSh)", "number", { required: true }),
        field("description", "Description", "textarea", { required: true, full: true }),
      ]},
      { title: "Ownership & documentation", fields: [
        field("ownership_status", "Seller's ownership status", "select", { required: true, options: ["Sole owner", "Joint/family owned", "Company owned", "Other / not the owner"] }),
        field("title_deed_availability", "Title / deed availability", "select", { options: YES_NO_UNKNOWN }),
        field("survey_information", "Survey information", "textarea", { full: true }),
        field("utilities", "Utilities", "text", { placeholder: "e.g. water, electricity, sewer" }),
        field("road_access", "Road access", "select", { options: ["All-weather road", "Seasonal/dirt road", "No direct access", "Unknown"] }),
        field("development_status", "Development status", "select", { options: ["Vacant", "Partially developed", "Fully developed"] }),
      ]},
    ],
    photos: ["Boundary / access road", "General view", "Nearby landmarks", "Title/deed document (if available)"],
    warning: "SellCheck does not verify legal title. Buyers must conduct an official land registry search and use qualified legal/professional assistance before payment. Do not upload full copies of sensitive ownership documents publicly.",
  },
  {
    id: "other", name: "Other", icon: "OT",
    desc: "Anything that doesn't fit the categories above",
    sections: [
      { title: "Item information", fields: [
        field("item_title", "Item name", "text", { required: true, full: true }),
        field("description", "Description", "textarea", { required: true, full: true }),
        field("brand", "Brand", "text", {}),
        field("model", "Model", "text", {}),
        field("year_age", "Age", "text", {}),
        field("condition", "Current condition", "select", { required: true, options: CONDITION_OPTIONS }),
        field("asking_price", "Asking price (KSh)", "number", { required: true }),
        field("location_county", "County", "text", { required: true }),
        field("location_town", "Town / location", "text", { required: true }),
        field("known_defects", "Known defects", "textarea", { full: true }),
        field("repair_history", "Repair history", "textarea", { full: true }),
        field("additional_information", "Additional information", "textarea", { full: true }),
      ]},
    ],
    photos: ["Photo 1", "Photo 2", "Photo 3", "Photo 4"],
  },
];

const SELLER_FIELDS = [
  field("seller_name", "Full name", "text", { required: true }),
  field("seller_phone", "Phone number", "tel", { required: true, placeholder: "07XX XXX XXX" }),
  field("seller_email", "Email", "email", {}),
  field("seller_county", "County", "text", { required: true }),
  field("seller_town", "Town / location", "text", { required: true }),
];

function categoryById(id) { return CATEGORIES.find(c => c.id === id); }

/* --------------------------------------------------------------------------
   3. STATE
   -------------------------------------------------------------------------- */
const state = {
  selectedCategory: null,
  currentStep: 0, // 0 = seller info, 1..n = category sections, last = photos+declaration
  formData: {},
};

/* --------------------------------------------------------------------------
   4. ROUTING
   -------------------------------------------------------------------------- */
const VIEWS = ["home", "submit", "check", "admin", "privacy", "terms"];

function navigate(view) {
  VIEWS.forEach(v => {
    const el = document.getElementById("view-" + v);
    if (el) el.classList.toggle("hidden", v !== view);
  });
  document.getElementById("mainNav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "submit") resetSubmitFlow();
  window.location.hash = view;
}

document.addEventListener("click", (e) => {
  const navEl = e.target.closest("[data-nav]");
  if (navEl) {
    e.preventDefault();
    navigate(navEl.getAttribute("data-nav"));
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const initial = (window.location.hash || "#home").replace("#", "");
  navigate(VIEWS.includes(initial) ? initial : "home");
  renderCategoryGrids();
  populateAdminCategoryFilter();
  checkBackendConfigured();
});

document.getElementById("navToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});
document.getElementById("footerPrivacyLink").addEventListener("click", (e) => { e.preventDefault(); navigate("privacy"); });
document.getElementById("footerTermsLink").addEventListener("click", (e) => { e.preventDefault(); navigate("terms"); });

/* --------------------------------------------------------------------------
   5. TOASTS
   -------------------------------------------------------------------------- */
let toastTimer;
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.toggle("error", isError);
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3800);
}

function checkBackendConfigured() {
  const configured = CONFIG.APPS_SCRIPT_URL && !CONFIG.APPS_SCRIPT_URL.includes("PASTE_YOUR");
  document.getElementById("apiStatusFooter").textContent = "Backend: " + (configured ? "connected" : "not configured");
}

/* --------------------------------------------------------------------------
   6. CATEGORY GRID RENDERING
   -------------------------------------------------------------------------- */
function categoryCardHTML(cat) {
  return `<button type="button" class="cat-card" data-cat="${cat.id}">
    <span class="cat-icon">${cat.icon}</span>
    <span class="cat-name">${cat.name}</span>
    <span class="cat-desc">${cat.desc}</span>
  </button>`;
}

function renderCategoryGrids() {
  const homeGrid = document.getElementById("homeCatPreview");
  const submitGrid = document.getElementById("categoryGrid");
  homeGrid.innerHTML = CATEGORIES.map(categoryCardHTML).join("");
  submitGrid.innerHTML = CATEGORIES.map(categoryCardHTML).join("");

  // Home preview cards jump to the submit flow and preselect the category.
  homeGrid.querySelectorAll(".cat-card").forEach(btn => {
    btn.addEventListener("click", () => {
      navigate("submit");
      selectCategory(btn.getAttribute("data-cat"));
    });
  });
  submitGrid.querySelectorAll(".cat-card").forEach(btn => {
    btn.addEventListener("click", () => selectCategory(btn.getAttribute("data-cat")));
  });
}

function populateAdminCategoryFilter() {
  const sel = document.getElementById("adminCategoryFilter");
  CATEGORIES.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id; opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

/* --------------------------------------------------------------------------
   7. SUBMIT FLOW
   -------------------------------------------------------------------------- */
function resetSubmitFlow() {
  state.selectedCategory = null;
  state.currentStep = 0;
  state.formData = {};
  document.getElementById("categoryStep").classList.remove("hidden");
  document.getElementById("formStep").classList.add("hidden");
  document.getElementById("successStep").classList.add("hidden");
  document.querySelectorAll("#categoryGrid .cat-card").forEach(c => c.classList.remove("selected"));
}

function selectCategory(catId) {
  state.selectedCategory = categoryById(catId);
  state.currentStep = 0;
  state.formData = {};
  document.querySelectorAll("#categoryGrid .cat-card").forEach(c => c.classList.toggle("selected", c.getAttribute("data-cat") === catId));
  document.getElementById("categoryStep").classList.add("hidden");
  document.getElementById("formStep").classList.remove("hidden");
  buildFormSteps();
  renderStep();
}

document.getElementById("changeCategoryBtn").addEventListener("click", () => {
  document.getElementById("formStep").classList.add("hidden");
  document.getElementById("categoryStep").classList.remove("hidden");
});

/* Steps: 0 = seller info, 1..N = category sections, N+1 = photos + declaration */
let FORM_STEPS = [];

function buildFormSteps() {
  const cat = state.selectedCategory;
  FORM_STEPS = [];
  FORM_STEPS.push({ type: "seller", title: "Seller information", fields: SELLER_FIELDS });
  cat.sections.forEach(sec => FORM_STEPS.push({ type: "fields", title: sec.title, fields: sec.fields }));
  FORM_STEPS.push({ type: "photos", title: "Photos & documents" });
  FORM_STEPS.push({ type: "declaration", title: "Review & submit" });
}

function fieldInputHTML(f) {
  const id = "f_" + f.id;
  const req = f.required ? "required" : "";
  let inner = "";
  if (f.type === "select") {
    inner = `<select id="${id}" name="${f.id}" ${req}><option value="">Select…</option>${f.options.map(o => `<option value="${o}">${o}</option>`).join("")}</select>`;
  } else if (f.type === "textarea") {
    inner = `<textarea id="${id}" name="${f.id}" ${req} placeholder="${f.placeholder}"></textarea>`;
  } else {
    inner = `<input type="${f.type}" id="${id}" name="${f.id}" ${req} placeholder="${f.placeholder}">`;
  }
  return `<div class="field ${f.full ? "full" : ""}" id="wrap_${f.id}">
    <label for="${id}">${f.label} ${f.required ? "" : '<span class="opt">(optional)</span>'}</label>
    ${inner}
    <p class="error-msg">This field is required.</p>
  </div>`;
}

function renderStep() {
  const step = FORM_STEPS[state.currentStep];
  const container = document.getElementById("formSections");
  const cat = state.selectedCategory;
  let html = "";

  if (step.type === "seller" || step.type === "fields") {
    html += `<fieldset><legend>${step.title}</legend><div class="field-grid">`;
    html += step.fields.map(fieldInputHTML).join("");
    html += `</div></fieldset>`;
  } else if (step.type === "photos") {
    html += `<fieldset><legend>Photos &amp; documents</legend>
      <p class="hint" style="margin-bottom:14px;">Paste a link for each photo (Google Drive, Google Photos, or any image hosting link with "anyone with the link can view" access). Photos aren't required to submit, but submissions with photos score higher on completeness.</p>
      ${cat.warning ? `<div class="notice notice-amber" style="margin-bottom:18px;"><span class="notice-icon">!</span><p>${cat.warning}</p></div>` : ""}
      <div class="photo-list">
        ${cat.photos.map((p, i) => `
          <div class="photo-row">
            <p class="photo-label">${p}</p>
            <input type="url" id="photo_${i}" data-photo-label="${p}" placeholder="https://...">
          </div>`).join("")}
      </div>
    </fieldset>`;
  } else if (step.type === "declaration") {
    html += `<fieldset><legend>Declaration &amp; submit</legend>
      <div class="notice notice-amber" style="margin-bottom:16px;">
        <span class="notice-icon">!</span>
        <p><strong>Important notice.</strong> Submitting this form does not confirm ownership, authenticity, roadworthiness, legal status, condition, or value. Buyers should independently verify documents and inspect the item before paying.</p>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="declaration" required>
        <label for="declaration">I confirm the information provided is accurate to the best of my knowledge, and I understand SellCheck KE does not verify or guarantee this listing.</label>
      </div>
      <p class="error-msg" id="declarationError">Please confirm the declaration before submitting.</p>
    </fieldset>`;
  }

  container.innerHTML = html;
  restoreStepValues(step);
  attachLiveListeners();
  updateProgress();
  updateCompleteness();
  renderFormNav();
}

function restoreStepValues(step) {
  if (step.type === "seller" || step.type === "fields") {
    step.fields.forEach(f => {
      const el = document.getElementById("f_" + f.id);
      if (el && state.formData[f.id] !== undefined) el.value = state.formData[f.id];
    });
  } else if (step.type === "photos") {
    state.selectedCategory.photos.forEach((p, i) => {
      const el = document.getElementById("photo_" + i);
      if (el && state.formData["photo_" + i] !== undefined) el.value = state.formData["photo_" + i];
    });
  } else if (step.type === "declaration") {
    const el = document.getElementById("declaration");
    if (el) el.checked = !!state.formData.declaration;
  }
}

function attachLiveListeners() {
  document.querySelectorAll("#formSections input, #formSections select, #formSections textarea").forEach(el => {
    el.addEventListener("input", () => {
      const key = el.type === "url" && el.id.startsWith("photo_") ? el.id : (el.id === "declaration" ? "declaration" : el.name);
      state.formData[key] = el.type === "checkbox" ? el.checked : el.value;
      updateCompleteness();
      el.closest(".field")?.classList.remove("field-error");
    });
  });
}

function renderFormNav() {
  const existing = document.getElementById("formNavRow");
  if (existing) existing.remove();
  const nav = document.createElement("div");
  nav.className = "form-nav";
  nav.id = "formNavRow";
  const isFirst = state.currentStep === 0;
  const isLast = state.currentStep === FORM_STEPS.length - 1;
  nav.innerHTML = `
    <button type="button" class="btn btn-secondary" id="prevStepBtn" ${isFirst ? "disabled" : ""}>&larr; Back</button>
    <button type="button" class="btn btn-primary" id="nextStepBtn">${isLast ? "Submit item" : "Continue"}</button>
  `;
  document.getElementById("itemForm").appendChild(nav);
  document.getElementById("prevStepBtn").addEventListener("click", () => {
    if (state.currentStep > 0) { state.currentStep--; renderStep(); }
  });
  document.getElementById("nextStepBtn").addEventListener("click", () => {
    if (!validateStep(FORM_STEPS[state.currentStep])) return;
    if (isLast) { submitForm(); return; }
    state.currentStep++;
    renderStep();
  });
}

function validateStep(step) {
  let valid = true;
  if (step.type === "seller" || step.type === "fields") {
    step.fields.forEach(f => {
      if (!f.required) return;
      const el = document.getElementById("f_" + f.id);
      const val = el.value.trim();
      const wrap = document.getElementById("wrap_" + f.id);
      if (!val) { wrap.classList.add("field-error"); valid = false; }
      else wrap.classList.remove("field-error");
    });
  } else if (step.type === "declaration") {
    const el = document.getElementById("declaration");
    const err = document.getElementById("declarationError");
    if (!el.checked) { err.style.display = "block"; valid = false; }
    else err.style.display = "none";
  }
  if (!valid) showToast("Please complete the required fields highlighted below.", true);
  return valid;
}

function updateProgress() {
  const pct = Math.round(((state.currentStep) / (FORM_STEPS.length - 1)) * 100);
  document.getElementById("progressLabel").textContent = `Step ${state.currentStep + 1} of ${FORM_STEPS.length}: ${FORM_STEPS[state.currentStep].title}`;
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressPct").textContent = pct + "%";
}

/* Completeness score: proportion of all weighted fields (all category+common
   fields + seller fields + photos) that currently have a value, across the
   whole submission — not just the current step. */
function updateCompleteness() {
  const cat = state.selectedCategory;
  if (!cat) return;
  let total = 0, filled = 0;
  SELLER_FIELDS.forEach(f => { total++; if ((state.formData[f.id] || "").toString().trim()) filled++; });
  cat.sections.forEach(sec => sec.fields.forEach(f => { total++; if ((state.formData[f.id] || "").toString().trim()) filled++; }));
  cat.photos.forEach((p, i) => { total++; if ((state.formData["photo_" + i] || "").toString().trim()) filled++; });
  const pct = total ? Math.round((filled / total) * 100) : 0;
  const ring = document.getElementById("meterRing");
  if (ring) { ring.style.setProperty("--pct", pct); document.getElementById("meterPct").textContent = pct + "%"; }
  return pct;
}

/* --------------------------------------------------------------------------
   8. SUBMIT TO BACKEND
   -------------------------------------------------------------------------- */
async function submitForm() {
  if (!backendReady()) return;
  const cat = state.selectedCategory;
  const completeness = updateCompleteness();

  const seller = {};
  SELLER_FIELDS.forEach(f => seller[f.id] = state.formData[f.id] || "");

  const item = { category: cat.id, category_name: cat.name };
  cat.sections.forEach(sec => sec.fields.forEach(f => item[f.id] = state.formData[f.id] || ""));

  const photos = {};
  cat.photos.forEach((p, i) => { if (state.formData["photo_" + i]) photos[p] = state.formData["photo_" + i]; });

  const payload = {
    action: "submit",
    category: cat.id,
    seller,
    item,
    photos,
    completeness,
    declaration: true,
  };

  const btn = document.getElementById("nextStepBtn");
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Submitting…`;

  try {
    const res = await postToBackend(payload);
    if (res && res.success && res.reference) {
      showSuccess(res.reference, res.reviewLink);
    } else {
      throw new Error((res && res.error) || "Submission failed. Please try again.");
    }
  } catch (err) {
    showToast(err.message || "Could not reach the SellCheck backend.", true);
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function showSuccess(reference, reviewLink) {
  document.getElementById("formStep").classList.add("hidden");
  document.getElementById("successStep").classList.remove("hidden");
  document.getElementById("successRef").textContent = reference;
  const link = reviewLink || (window.location.origin + window.location.pathname + "#check?ref=" + encodeURIComponent(reference));
  document.getElementById("successLink").textContent = link;
  document.getElementById("copyLinkBtn").onclick = () => {
    navigator.clipboard.writeText(link).then(() => showToast("Review link copied."));
  };
}

/* --------------------------------------------------------------------------
   9. BACKEND COMMUNICATION HELPERS
   -------------------------------------------------------------------------- */
function backendReady() {
  if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    showToast("Backend not configured yet — add your Apps Script URL in script.js.", true);
    return false;
  }
  return true;
}

async function postToBackend(payload) {
  // text/plain avoids a CORS preflight against Apps Script web apps.
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Network error contacting the backend.");
  return res.json();
}

async function getFromBackend(params) {
  const url = new URL(CONFIG.APPS_SCRIPT_URL);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Network error contacting the backend.");
  return res.json();
}

/* --------------------------------------------------------------------------
   10. CHECK A SUBMISSION
   -------------------------------------------------------------------------- */
document.getElementById("lookupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!backendReady()) return;
  const refInput = document.getElementById("lookupRef");
  const ref = refInput.value.trim().toUpperCase();
  const errEl = document.getElementById("lookupError");
  const valid = /^SC-KE-\d{4}-\d{5}$/.test(ref);
  if (!valid) { errEl.style.display = "block"; return; }
  errEl.style.display = "none";

  const btn = document.getElementById("lookupBtn");
  const original = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner spinner-dark"></span> Checking…`;
  document.getElementById("lookupResultWrap").classList.add("hidden");

  try {
    const res = await getFromBackend({ action: "lookup", ref });
    if (res && res.success && res.submission) {
      renderLookupResult(res.submission);
    } else {
      showToast((res && res.error) || "No submission found for that reference.", true);
    }
  } catch (err) {
    showToast("Could not reach the SellCheck backend.", true);
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});

function renderLookupResult(sub) {
  const wrap = document.getElementById("lookupResultWrap");
  const el = document.getElementById("lookupResult");
  const rows = [
    ["Reference", sub.reference],
    ["Category", sub.category_name],
    ["Title", sub.item_title],
    ["Asking price", sub.asking_price ? "KSh " + Number(sub.asking_price).toLocaleString() : "—"],
    ["Condition", sub.condition || "—"],
    ["Location", [sub.location_town, sub.location_county].filter(Boolean).join(", ") || "—"],
    ["Description", sub.description || "—"],
    ["Known defects", sub.known_defects || "—"],
    ["Information completeness", (sub.completeness || 0) + "%"],
    ["Status", sub.status || "New"],
    ["Submitted", sub.submitted_at || "—"],
  ];
  el.innerHTML = `<h3 style="margin-bottom:4px;">${sub.item_title || "Submission"}</h3>
    <p class="hint" style="margin-bottom:18px;">This summary reflects information the seller submitted. It is not verified by SellCheck KE.</p>
    <dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${escapeHTML(String(v))}</dd>`).join("")}</dl>`;
  wrap.classList.remove("hidden");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* --------------------------------------------------------------------------
   11. ADMIN DASHBOARD
   -------------------------------------------------------------------------- */
let adminToken = null;
let adminData = [];

document.getElementById("adminLoginBtn").addEventListener("click", async () => {
  if (!backendReady()) return;
  const pw = document.getElementById("adminPassword").value;
  const btn = document.getElementById("adminLoginBtn");
  const original = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner spinner-dark"></span> Signing in…`;
  try {
    const res = await getFromBackend({ action: "adminAuth", password: pw });
    if (res && res.success && res.token) {
      adminToken = res.token;
      document.getElementById("adminLoginStep").classList.add("hidden");
      document.getElementById("adminDashboardStep").classList.remove("hidden");
      loadAdminData();
    } else {
      document.getElementById("adminLoginError").style.display = "block";
    }
  } catch (err) {
    document.getElementById("adminLoginError").textContent = "Could not reach the SellCheck backend.";
    document.getElementById("adminLoginError").style.display = "block";
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});

document.getElementById("adminLogoutBtn").addEventListener("click", () => {
  adminToken = null;
  document.getElementById("adminDashboardStep").classList.add("hidden");
  document.getElementById("adminLoginStep").classList.remove("hidden");
  document.getElementById("adminPassword").value = "";
});
document.getElementById("adminRefreshBtn").addEventListener("click", loadAdminData);
["adminSearch", "adminCategoryFilter", "adminStatusFilter", "adminLocationFilter"].forEach(id => {
  document.getElementById(id).addEventListener("input", renderAdminTable);
});

async function loadAdminData() {
  const body = document.getElementById("adminTableBody");
  body.innerHTML = `<tr><td colspan="8">Loading submissions…</td></tr>`;
  try {
    const res = await getFromBackend({ action: "adminList", token: adminToken });
    if (res && res.success) {
      adminData = res.submissions || [];
      renderAdminTable();
    } else {
      body.innerHTML = `<tr><td colspan="8">Could not load submissions: ${escapeHTML((res && res.error) || "unknown error")}</td></tr>`;
    }
  } catch (err) {
    body.innerHTML = `<tr><td colspan="8">Could not reach the SellCheck backend.</td></tr>`;
  }
}

function renderAdminTable() {
  const search = document.getElementById("adminSearch").value.trim().toUpperCase();
  const catFilter = document.getElementById("adminCategoryFilter").value;
  const statusFilter = document.getElementById("adminStatusFilter").value;
  const locFilter = document.getElementById("adminLocationFilter").value.trim().toLowerCase();

  const filtered = adminData.filter(s => {
    if (search && !(s.reference || "").toUpperCase().includes(search)) return false;
    if (catFilter && s.category !== catFilter) return false;
    if (statusFilter && (s.status || "New") !== statusFilter) return false;
    if (locFilter && !((s.location_town || "") + " " + (s.location_county || "")).toLowerCase().includes(locFilter)) return false;
    return true;
  });

  const body = document.getElementById("adminTableBody");
  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="8">No submissions match these filters.</td></tr>`;
    return;
  }

  const statuses = ["New", "Under Review", "Inspection Pending", "Inspected", "Closed"];
  body.innerHTML = filtered.map(s => `
    <tr>
      <td><code>${escapeHTML(s.reference || "")}</code></td>
      <td>${escapeHTML(s.category_name || s.category || "")}</td>
      <td>${escapeHTML(s.item_title || "")}</td>
      <td>${s.asking_price ? Number(s.asking_price).toLocaleString() : "—"}</td>
      <td>${escapeHTML([s.location_town, s.location_county].filter(Boolean).join(", "))}</td>
      <td>${escapeHTML(s.submitted_at || "")}</td>
      <td>
        <select class="status-select" data-ref="${escapeHTML(s.reference || "")}">
          ${statuses.map(st => `<option value="${st}" ${((s.status || "New") === st) ? "selected" : ""}>${st}</option>`).join("")}
        </select>
      </td>
      <td>${s.photo_count ? s.photo_count + " linked" : "—"}</td>
    </tr>
  `).join("");

  body.querySelectorAll(".status-select").forEach(sel => {
    sel.addEventListener("change", () => updateStatus(sel.getAttribute("data-ref"), sel.value));
  });
}

async function updateStatus(ref, status) {
  try {
    const res = await postToBackendRaw({ action: "updateStatus", token: adminToken, ref, status });
    if (res && res.success) {
      showToast(`${ref} marked as ${status}.`);
      const rec = adminData.find(s => s.reference === ref);
      if (rec) rec.status = status;
    } else {
      showToast((res && res.error) || "Could not update status.", true);
    }
  } catch (err) {
    showToast("Could not reach the SellCheck backend.", true);
  }
}

async function postToBackendRaw(payload) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

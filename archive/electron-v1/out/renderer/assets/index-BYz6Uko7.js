const segmentDefinitions = {
  MSH: {
    name: "Message Header",
    fields: {
      1: { name: "Field Separator", datatype: "ST" },
      2: { name: "Encoding Characters", datatype: "ST" },
      3: { name: "Sending Application", datatype: "HD" },
      4: { name: "Sending Facility", datatype: "HD" },
      5: { name: "Receiving Application", datatype: "HD" },
      6: { name: "Receiving Facility", datatype: "HD" },
      7: { name: "Date/Time of Message", datatype: "TS" },
      8: { name: "Security", datatype: "ST" },
      9: { name: "Message Type", datatype: "MSG" },
      10: { name: "Message Control ID", datatype: "ST" },
      11: { name: "Processing ID", datatype: "PT" },
      12: { name: "Version ID", datatype: "VID" },
      13: { name: "Sequence Number", datatype: "NM" },
      14: { name: "Continuation Pointer", datatype: "ST" },
      15: { name: "Accept Acknowledgment Type", datatype: "ID" },
      16: { name: "Application Acknowledgment Type", datatype: "ID" },
      17: { name: "Country Code", datatype: "ID" },
      18: { name: "Character Set", datatype: "ID" },
      19: { name: "Principal Language of Message", datatype: "CE" }
    }
  },
  EVN: {
    name: "Event Type",
    fields: {
      1: { name: "Event Type Code", datatype: "ID" },
      2: { name: "Recorded Date/Time", datatype: "TS" },
      3: { name: "Date/Time Planned Event", datatype: "TS" },
      4: { name: "Event Reason Code", datatype: "IS" },
      5: { name: "Operator ID", datatype: "XCN" },
      6: { name: "Event Occurred", datatype: "TS" },
      7: { name: "Event Facility", datatype: "HD" }
    }
  },
  PID: {
    name: "Patient Identification",
    fields: {
      1: { name: "Set ID - PID", datatype: "SI" },
      2: { name: "Patient ID", datatype: "CX" },
      3: { name: "Patient Identifier List", datatype: "CX" },
      4: { name: "Alternate Patient ID", datatype: "CX" },
      5: { name: "Patient Name", datatype: "XPN" },
      6: { name: "Mother's Maiden Name", datatype: "XPN" },
      7: { name: "Date/Time of Birth", datatype: "TS" },
      8: { name: "Administrative Sex", datatype: "IS" },
      9: { name: "Patient Alias", datatype: "XPN" },
      10: { name: "Race", datatype: "CE" },
      11: { name: "Patient Address", datatype: "XAD" },
      12: { name: "County Code", datatype: "IS" },
      13: { name: "Phone Number - Home", datatype: "XTN" },
      14: { name: "Phone Number - Business", datatype: "XTN" },
      15: { name: "Primary Language", datatype: "CE" },
      16: { name: "Marital Status", datatype: "CE" },
      17: { name: "Religion", datatype: "CE" },
      18: { name: "Patient Account Number", datatype: "CX" },
      19: { name: "SSN Number - Patient", datatype: "ST" },
      20: { name: "Driver's License Number - Patient", datatype: "DLN" },
      21: { name: "Mother's Identifier", datatype: "CX" },
      22: { name: "Ethnic Group", datatype: "CE" },
      23: { name: "Birth Place", datatype: "ST" },
      24: { name: "Multiple Birth Indicator", datatype: "ID" },
      25: { name: "Birth Order", datatype: "NM" },
      26: { name: "Citizenship", datatype: "CE" },
      27: { name: "Veterans Military Status", datatype: "CE" },
      28: { name: "Nationality", datatype: "CE" },
      29: { name: "Patient Death Date and Time", datatype: "TS" },
      30: { name: "Patient Death Indicator", datatype: "ID" }
    }
  },
  NK1: {
    name: "Next of Kin / Associated Parties",
    fields: {
      1: { name: "Set ID - NK1", datatype: "SI" },
      2: { name: "Name", datatype: "XPN" },
      3: { name: "Relationship", datatype: "CE" },
      4: { name: "Address", datatype: "XAD" },
      5: { name: "Phone Number", datatype: "XTN" },
      6: { name: "Business Phone Number", datatype: "XTN" },
      7: { name: "Contact Role", datatype: "CE" },
      8: { name: "Start Date", datatype: "DT" },
      9: { name: "End Date", datatype: "DT" },
      10: { name: "Next of Kin / Associated Parties Job Title", datatype: "ST" },
      11: { name: "Next of Kin / Associated Parties Job Code/Class", datatype: "JCC" },
      12: { name: "Next of Kin / Associated Parties Employee Number", datatype: "CX" },
      13: { name: "Organization Name - NK1", datatype: "XON" },
      14: { name: "Marital Status", datatype: "CE" },
      15: { name: "Administrative Sex", datatype: "IS" },
      16: { name: "Date/Time of Birth", datatype: "TS" },
      17: { name: "Living Dependency", datatype: "IS" },
      18: { name: "Ambulatory Status", datatype: "IS" },
      19: { name: "Citizenship", datatype: "CE" },
      20: { name: "Primary Language", datatype: "CE" },
      21: { name: "Living Arrangement", datatype: "IS" },
      22: { name: "Publicity Code", datatype: "CE" },
      23: { name: "Protection Indicator", datatype: "ID" },
      24: { name: "Student Indicator", datatype: "IS" },
      25: { name: "Religion", datatype: "CE" },
      26: { name: "Mother's Maiden Name", datatype: "XPN" },
      27: { name: "Nationality", datatype: "CE" },
      28: { name: "Ethnic Group", datatype: "CE" },
      29: { name: "Contact Reason", datatype: "CE" }
    }
  },
  PV1: {
    name: "Patient Visit",
    fields: {
      1: { name: "Set ID - PV1", datatype: "SI" },
      2: { name: "Patient Class", datatype: "IS" },
      3: { name: "Assigned Patient Location", datatype: "PL" },
      4: { name: "Admission Type", datatype: "IS" },
      5: { name: "Preadmit Number", datatype: "CX" },
      6: { name: "Prior Patient Location", datatype: "PL" },
      7: { name: "Attending Doctor", datatype: "XCN" },
      8: { name: "Referring Doctor", datatype: "XCN" },
      9: { name: "Consulting Doctor", datatype: "XCN" },
      10: { name: "Hospital Service", datatype: "IS" },
      11: { name: "Temporary Location", datatype: "PL" },
      12: { name: "Preadmit Test Indicator", datatype: "IS" },
      13: { name: "Readmission Indicator", datatype: "IS" },
      14: { name: "Admit Source", datatype: "IS" },
      15: { name: "Ambulatory Status", datatype: "IS" },
      16: { name: "VIP Indicator", datatype: "IS" },
      17: { name: "Admitting Doctor", datatype: "XCN" },
      18: { name: "Patient Type", datatype: "IS" },
      19: { name: "Visit Number", datatype: "CX" },
      20: { name: "Financial Class", datatype: "FC" },
      44: { name: "Admit Date/Time", datatype: "TS" },
      45: { name: "Discharge Date/Time", datatype: "TS" }
    }
  },
  PV2: {
    name: "Patient Visit - Additional Information",
    fields: {
      1: { name: "Prior Pending Location", datatype: "PL" },
      2: { name: "Accommodation Code", datatype: "CE" },
      3: { name: "Admit Reason", datatype: "CE" },
      4: { name: "Transfer Reason", datatype: "CE" },
      5: { name: "Patient Valuables", datatype: "ST" },
      6: { name: "Patient Valuables Location", datatype: "ST" },
      7: { name: "Visit User Code", datatype: "IS" },
      8: { name: "Expected Admit Date/Time", datatype: "TS" },
      9: { name: "Expected Discharge Date/Time", datatype: "TS" },
      10: { name: "Estimated Length of Inpatient Stay", datatype: "NM" },
      11: { name: "Actual Length of Inpatient Stay", datatype: "NM" },
      12: { name: "Visit Description", datatype: "ST" },
      13: { name: "Referral Source Code", datatype: "XCN" },
      14: { name: "Previous Service Date", datatype: "DT" },
      15: { name: "Employment Illness Related Indicator", datatype: "ID" },
      16: { name: "Purge Status Code", datatype: "IS" },
      17: { name: "Purge Status Date", datatype: "DT" },
      18: { name: "Special Program Code", datatype: "IS" },
      19: { name: "Retention Indicator", datatype: "ID" },
      20: { name: "Expected Number of Insurance Plans", datatype: "NM" },
      21: { name: "Visit Publicity Code", datatype: "IS" },
      22: { name: "Visit Protection Indicator", datatype: "ID" },
      23: { name: "Clinic Organization Name", datatype: "XON" },
      24: { name: "Patient Status Code", datatype: "IS" },
      46: { name: "Patient Status Effective Date", datatype: "DT" },
      47: { name: "Expected LOA Return Date/Time", datatype: "TS" }
    }
  },
  ORC: {
    name: "Common Order",
    fields: {
      1: { name: "Order Control", datatype: "ID" },
      2: { name: "Placer Order Number", datatype: "EI" },
      3: { name: "Filler Order Number", datatype: "EI" },
      4: { name: "Placer Group Number", datatype: "EI" },
      5: { name: "Order Status", datatype: "ID" },
      6: { name: "Response Flag", datatype: "ID" },
      7: { name: "Quantity/Timing", datatype: "TQ" },
      8: { name: "Parent", datatype: "EIP" },
      9: { name: "Date/Time of Transaction", datatype: "TS" },
      10: { name: "Entered By", datatype: "XCN" },
      11: { name: "Verified By", datatype: "XCN" },
      12: { name: "Ordering Provider", datatype: "XCN" },
      13: { name: "Enterer's Location", datatype: "PL" },
      14: { name: "Call Back Phone Number", datatype: "XTN" },
      15: { name: "Order Effective Date/Time", datatype: "TS" },
      16: { name: "Order Control Code Reason", datatype: "CE" },
      17: { name: "Entering Organization", datatype: "CE" },
      18: { name: "Entering Device", datatype: "CE" },
      19: { name: "Action By", datatype: "XCN" }
    }
  },
  OBR: {
    name: "Observation Request",
    fields: {
      1: { name: "Set ID - OBR", datatype: "SI" },
      2: { name: "Placer Order Number", datatype: "EI" },
      3: { name: "Filler Order Number", datatype: "EI" },
      4: { name: "Universal Service Identifier", datatype: "CE" },
      5: { name: "Priority", datatype: "ID" },
      6: { name: "Requested Date/Time", datatype: "TS" },
      7: { name: "Observation Date/Time", datatype: "TS" },
      8: { name: "Observation End Date/Time", datatype: "TS" },
      9: { name: "Collection Volume", datatype: "CQ" },
      10: { name: "Collector Identifier", datatype: "XCN" },
      11: { name: "Specimen Action Code", datatype: "ID" },
      12: { name: "Danger Code", datatype: "CE" },
      13: { name: "Relevant Clinical Information", datatype: "ST" },
      14: { name: "Specimen Received Date/Time", datatype: "TS" },
      15: { name: "Specimen Source", datatype: "SPS" },
      16: { name: "Ordering Provider", datatype: "XCN" },
      17: { name: "Order Callback Phone Number", datatype: "XTN" },
      18: { name: "Placer Field 1", datatype: "ST" },
      19: { name: "Placer Field 2", datatype: "ST" },
      20: { name: "Filler Field 1", datatype: "ST" },
      21: { name: "Filler Field 2", datatype: "ST" },
      22: { name: "Results Report/Status Change Date/Time", datatype: "TS" },
      24: { name: "Diagnostic Service Section ID", datatype: "ID" },
      25: { name: "Result Status", datatype: "ID" }
    }
  },
  OBX: {
    name: "Observation/Result",
    fields: {
      1: { name: "Set ID - OBX", datatype: "SI" },
      2: { name: "Value Type", datatype: "ID" },
      3: { name: "Observation Identifier", datatype: "CE" },
      4: { name: "Observation Sub-ID", datatype: "ST" },
      5: { name: "Observation Value", datatype: "VARIES" },
      6: { name: "Units", datatype: "CE" },
      7: { name: "Reference Range", datatype: "ST" },
      8: { name: "Abnormal Flags", datatype: "IS" },
      9: { name: "Probability", datatype: "NM" },
      10: { name: "Nature of Abnormal Test", datatype: "ID" },
      11: { name: "Observation Result Status", datatype: "ID" },
      12: { name: "Effective Date of Reference Range", datatype: "TS" },
      13: { name: "User Defined Access Checks", datatype: "ST" },
      14: { name: "Date/Time of the Observation", datatype: "TS" },
      15: { name: "Producer's ID", datatype: "CE" },
      16: { name: "Responsible Observer", datatype: "XCN" },
      17: { name: "Observation Method", datatype: "CE" }
    }
  },
  NTE: {
    name: "Notes and Comments",
    fields: {
      1: { name: "Set ID - NTE", datatype: "SI" },
      2: { name: "Source of Comment", datatype: "ID" },
      3: { name: "Comment", datatype: "FT" },
      4: { name: "Comment Type", datatype: "CE" }
    }
  },
  DG1: {
    name: "Diagnosis",
    fields: {
      1: { name: "Set ID - DG1", datatype: "SI" },
      2: { name: "Diagnosis Coding Method", datatype: "ID" },
      3: { name: "Diagnosis Code", datatype: "CE" },
      4: { name: "Diagnosis Description", datatype: "ST" },
      5: { name: "Diagnosis Date/Time", datatype: "TS" },
      6: { name: "Diagnosis Type", datatype: "IS" },
      15: { name: "Diagnosis Priority", datatype: "NM" },
      16: { name: "Diagnosing Clinician", datatype: "XCN" }
    }
  },
  PR1: {
    name: "Procedures",
    fields: {
      1: { name: "Set ID - PR1", datatype: "SI" },
      2: { name: "Procedure Coding Method", datatype: "IS" },
      3: { name: "Procedure Code", datatype: "CE" },
      4: { name: "Procedure Description", datatype: "ST" },
      5: { name: "Procedure Date/Time", datatype: "TS" },
      6: { name: "Procedure Functional Type", datatype: "IS" },
      7: { name: "Procedure Minutes", datatype: "NM" },
      8: { name: "Anesthesiologist", datatype: "XCN" },
      9: { name: "Anesthesia Code", datatype: "IS" },
      10: { name: "Anesthesia Minutes", datatype: "NM" },
      11: { name: "Surgeon", datatype: "XCN" },
      12: { name: "Procedure Practitioner", datatype: "XCN" },
      13: { name: "Consent Code", datatype: "CE" },
      14: { name: "Procedure Priority", datatype: "ID" },
      15: { name: "Associated Diagnosis Code", datatype: "CE" },
      16: { name: "Procedure Code Modifier", datatype: "CE" },
      17: { name: "Procedure DRG Type", datatype: "IS" },
      18: { name: "Tissue Type Code", datatype: "CE" }
    }
  },
  ROL: {
    name: "Role",
    fields: {
      1: { name: "Role Instance ID", datatype: "EI" },
      2: { name: "Action Code", datatype: "ID" },
      3: { name: "Role", datatype: "CE" },
      4: { name: "Role Person", datatype: "XCN" },
      5: { name: "Role Begin Date/Time", datatype: "TS" },
      6: { name: "Role End Date/Time", datatype: "TS" },
      7: { name: "Role Duration", datatype: "CE" },
      8: { name: "Role Action Reason", datatype: "CE" },
      9: { name: "Provider Type", datatype: "CE" },
      10: { name: "Organization Unit Type", datatype: "CE" },
      11: { name: "Office/Home Address", datatype: "XAD" },
      12: { name: "Phone", datatype: "XTN" }
    }
  },
  IN1: {
    name: "Insurance",
    fields: {
      1: { name: "Set ID - IN1", datatype: "SI" },
      2: { name: "Insurance Plan ID", datatype: "CE" },
      3: { name: "Insurance Company ID", datatype: "CX" },
      4: { name: "Insurance Company Name", datatype: "XON" },
      5: { name: "Insurance Company Address", datatype: "XAD" },
      6: { name: "Insurance Co Contact Person", datatype: "XPN" },
      7: { name: "Insurance Co Phone Number", datatype: "XTN" },
      8: { name: "Group Number", datatype: "ST" },
      9: { name: "Group Name", datatype: "XON" },
      16: { name: "Name of Insured", datatype: "XPN" },
      17: { name: "Insured's Relationship to Patient", datatype: "CE" },
      18: { name: "Insured's Date of Birth", datatype: "TS" },
      19: { name: "Insured's Address", datatype: "XAD" },
      36: { name: "Policy Number", datatype: "ST" }
    }
  },
  IN2: {
    name: "Insurance Additional Information",
    fields: {
      1: { name: "Insured's Employee ID", datatype: "CX" },
      2: { name: "Insured's Social Security Number", datatype: "ST" },
      3: { name: "Insured's Employer's Name and ID", datatype: "XCN" },
      4: { name: "Employer Information Data", datatype: "IS" },
      5: { name: "Mail Claim Party", datatype: "IS" },
      6: { name: "Medicare Health Ins Card Number", datatype: "ST" },
      7: { name: "Medicaid Case Name", datatype: "XPN" },
      8: { name: "Medicaid Case Number", datatype: "ST" },
      9: { name: "Military Sponsor Name", datatype: "XPN" },
      10: { name: "Military ID Number", datatype: "ST" },
      11: { name: "Dependent Of Military Recipient", datatype: "CE" },
      12: { name: "Military Organization", datatype: "ST" },
      13: { name: "Military Station", datatype: "ST" },
      14: { name: "Military Service", datatype: "IS" },
      15: { name: "Military Rank/Grade", datatype: "IS" },
      16: { name: "Military Status", datatype: "IS" },
      17: { name: "Military Retire Date", datatype: "DT" },
      18: { name: "Military Non-Avail Cert On File", datatype: "ID" },
      19: { name: "Baby Coverage", datatype: "ID" },
      20: { name: "Combine Baby Bill", datatype: "ID" },
      21: { name: "Blood Deductible", datatype: "ST" },
      22: { name: "Special Coverage Approval Name", datatype: "XPN" },
      23: { name: "Special Coverage Approval Title", datatype: "ST" },
      24: { name: "Non-Covered Insurance Code", datatype: "IS" },
      25: { name: "Payor ID", datatype: "CX" },
      26: { name: "Payor Subscriber ID", datatype: "CX" },
      27: { name: "Eligibility Source", datatype: "IS" },
      28: { name: "Room Coverage Type/Amount", datatype: "CM" },
      29: { name: "Policy Type/Amount", datatype: "CM" },
      30: { name: "Daily Deductible", datatype: "CM" },
      31: { name: "Living Dependency", datatype: "IS" },
      32: { name: "Ambulatory Status", datatype: "IS" },
      33: { name: "Citizenship", datatype: "CE" },
      34: { name: "Primary Language", datatype: "CE" },
      35: { name: "Living Arrangement", datatype: "IS" },
      36: { name: "Publicity Code", datatype: "CE" },
      37: { name: "Protection Indicator", datatype: "ID" },
      38: { name: "Student Indicator", datatype: "IS" },
      39: { name: "Religion", datatype: "CE" },
      40: { name: "Mother's Maiden Name", datatype: "XPN" },
      41: { name: "Nationality", datatype: "CE" },
      42: { name: "Ethnic Group", datatype: "CE" },
      43: { name: "Marital Status", datatype: "CE" },
      44: { name: "Insured's Employment Start Date", datatype: "DT" },
      45: { name: "Employment Stop Date", datatype: "DT" },
      46: { name: "Job Title", datatype: "ST" },
      47: { name: "Job Code/Class", datatype: "JCC" },
      48: { name: "Job Status", datatype: "IS" },
      49: { name: "Employer Contact Person Name", datatype: "XPN" },
      50: { name: "Employer Contact Person Phone Number", datatype: "XTN" },
      51: { name: "Employer Contact Reason", datatype: "IS" },
      52: { name: "Insured's Contact Person's Name", datatype: "XPN" },
      53: { name: "Insured's Contact Person Phone Number", datatype: "XTN" },
      54: { name: "Insured's Contact Person Reason", datatype: "IS" },
      55: { name: "Relationship To The Patient Start Date", datatype: "DT" },
      56: { name: "Relationship To The Patient Stop Date", datatype: "DT" },
      57: { name: "Insurance Co. Contact Reason", datatype: "IS" },
      58: { name: "Insurance Co Contact Phone Number", datatype: "XTN" },
      59: { name: "Policy Scope", datatype: "IS" },
      60: { name: "Policy Source", datatype: "IS" },
      61: { name: "Patient Member Number", datatype: "CX" },
      62: { name: "Guarantor's Relationship To Insured", datatype: "CE" },
      63: { name: "Insured's Phone Number - Home", datatype: "XTN" },
      64: { name: "Insured's Employer Phone Number", datatype: "XTN" },
      65: { name: "Military Handicapped Program", datatype: "CE" },
      66: { name: "Suspend Flag", datatype: "ID" },
      67: { name: "Copay Limit Flag", datatype: "ID" },
      68: { name: "Stoploss Limit Flag", datatype: "ID" },
      69: { name: "Insured Organization Name And ID", datatype: "XON" },
      70: { name: "Insured Employer Organization Name And ID", datatype: "XON" },
      71: { name: "Race", datatype: "CE" },
      72: { name: "HCFA Patient's Relationship to Insured", datatype: "CE" }
    }
  },
  IN3: {
    name: "Insurance Additional Information, Certification",
    fields: {
      1: { name: "Set ID - IN3", datatype: "SI" },
      2: { name: "Certification Number", datatype: "CX" },
      3: { name: "Certified By", datatype: "XCN" },
      4: { name: "Certification Required", datatype: "ID" },
      5: { name: "Penalty", datatype: "CM" },
      6: { name: "Certification Date/Time", datatype: "TS" },
      7: { name: "Certification Modify Date/Time", datatype: "TS" },
      8: { name: "Operator", datatype: "XCN" },
      9: { name: "Certification Begin Date", datatype: "DT" },
      10: { name: "Certification End Date", datatype: "DT" },
      11: { name: "Days", datatype: "CM" },
      12: { name: "Non-Concur Code/Description", datatype: "CE" },
      13: { name: "Non-Concur Effective Date/Time", datatype: "TS" },
      14: { name: "Physician Reviewer", datatype: "XCN" },
      15: { name: "Certification Contact", datatype: "ST" },
      16: { name: "Certification Contact Phone Number", datatype: "XTN" },
      17: { name: "Appeal Reason", datatype: "CE" },
      18: { name: "Certification Agency", datatype: "CE" },
      19: { name: "Certification Agency Phone Number", datatype: "XTN" },
      20: { name: "Pre-Certification Req/Window", datatype: "CM" },
      21: { name: "Case Manager", datatype: "ST" },
      22: { name: "Second Opinion Date", datatype: "DT" },
      23: { name: "Second Opinion Status", datatype: "IS" },
      24: { name: "Second Opinion Documentation Received", datatype: "IS" },
      25: { name: "Second Opinion Physician", datatype: "XCN" }
    }
  },
  ARQ: {
    name: "Appointment Request",
    fields: {
      1: { name: "Placer Appointment ID", datatype: "EI" },
      2: { name: "Filler Appointment ID", datatype: "EI" },
      3: { name: "Occurrence Number", datatype: "NM" },
      4: { name: "Placer Group Number", datatype: "EI" },
      5: { name: "Schedule ID", datatype: "CE" },
      6: { name: "Request Event Reason", datatype: "CE" },
      7: { name: "Appointment Reason", datatype: "CE" },
      8: { name: "Appointment Type", datatype: "CE" },
      9: { name: "Appointment Duration", datatype: "NM" },
      10: { name: "Appointment Duration Units", datatype: "CE" },
      11: { name: "Requested Start Date/Time Range", datatype: "DR" },
      12: { name: "Priority-ARQ", datatype: "ST" },
      13: { name: "Repeating Interval", datatype: "RI" },
      14: { name: "Repeating Interval Duration", datatype: "ST" },
      15: { name: "Placer Contact Person", datatype: "XCN" },
      16: { name: "Placer Contact Phone Number", datatype: "XTN" },
      17: { name: "Placer Contact Address", datatype: "XAD" },
      18: { name: "Placer Contact Location", datatype: "PL" },
      19: { name: "Entered By Person", datatype: "XCN" },
      20: { name: "Entered By Phone Number", datatype: "XTN" },
      21: { name: "Entered By Location", datatype: "PL" },
      22: { name: "Parent Placer Appointment ID", datatype: "EI" },
      23: { name: "Parent Filler Appointment ID", datatype: "EI" },
      24: { name: "Placer Order Number", datatype: "EI" },
      25: { name: "Filler Order Number", datatype: "EI" }
    }
  },
  SCH: {
    name: "Schedule Activity Information",
    fields: {
      1: { name: "Placer Appointment ID", datatype: "EI" },
      2: { name: "Filler Appointment ID", datatype: "EI" },
      3: { name: "Occurrence Number", datatype: "NM" },
      4: { name: "Placer Group Number", datatype: "EI" },
      5: { name: "Schedule ID", datatype: "CE" },
      6: { name: "Event Reason", datatype: "CE" },
      7: { name: "Appointment Reason", datatype: "CE" },
      8: { name: "Appointment Type", datatype: "CE" },
      9: { name: "Appointment Duration", datatype: "NM" },
      10: { name: "Appointment Duration Units", datatype: "CE" },
      11: { name: "Appointment Timing Quantity", datatype: "TQ" },
      12: { name: "Placer Contact Person", datatype: "XCN" },
      13: { name: "Placer Contact Phone Number", datatype: "XTN" },
      14: { name: "Placer Contact Address", datatype: "XAD" },
      15: { name: "Placer Contact Location", datatype: "PL" },
      16: { name: "Filler Contact Person", datatype: "XCN" },
      17: { name: "Filler Contact Phone Number", datatype: "XTN" },
      18: { name: "Filler Contact Address", datatype: "XAD" },
      19: { name: "Filler Contact Location", datatype: "PL" },
      20: { name: "Entered By Person", datatype: "XCN" },
      21: { name: "Entered By Phone Number", datatype: "XTN" },
      22: { name: "Entered By Location", datatype: "PL" },
      23: { name: "Parent Placer Appointment ID", datatype: "EI" },
      24: { name: "Parent Filler Appointment ID", datatype: "EI" },
      25: { name: "Filler Status Code", datatype: "CE" },
      26: { name: "Placer Order Number", datatype: "EI" },
      27: { name: "Filler Order Number", datatype: "EI" }
    }
  },
  RGS: {
    name: "Resource Group",
    fields: {
      1: { name: "Set ID - RGS", datatype: "SI" },
      2: { name: "Segment Action Code", datatype: "ID" },
      3: { name: "Resource Group ID", datatype: "CE" }
    }
  },
  AIS: {
    name: "Appointment Information - Service",
    fields: {
      1: { name: "Set ID - AIS", datatype: "SI" },
      2: { name: "Segment Action Code", datatype: "ID" },
      3: { name: "Universal Service Identifier", datatype: "CE" },
      4: { name: "Start Date/Time", datatype: "TS" },
      5: { name: "Start Date/Time Offset", datatype: "NM" },
      6: { name: "Start Date/Time Offset Units", datatype: "CE" },
      7: { name: "Duration", datatype: "NM" },
      8: { name: "Duration Units", datatype: "CE" },
      9: { name: "Allow Substitution Code", datatype: "IS" },
      10: { name: "Filler Status Code", datatype: "CE" },
      11: { name: "Placer Supplemental Service / Logistical Information", datatype: "CE" },
      12: { name: "Filler Supplemental Service / Logistical Information", datatype: "CE" }
    }
  },
  AIG: {
    name: "Appointment Information - General Resource",
    fields: {
      1: { name: "Set ID - AIG", datatype: "SI" },
      2: { name: "Segment Action Code", datatype: "ID" },
      3: { name: "Resource ID", datatype: "CE" },
      4: { name: "Resource Type", datatype: "CE" },
      5: { name: "Resource Group", datatype: "CE" },
      6: { name: "Resource Quantity", datatype: "NM" },
      7: { name: "Resource Quantity Units", datatype: "CE" },
      8: { name: "Start Date/Time", datatype: "TS" },
      9: { name: "Start Date/Time Offset", datatype: "NM" },
      10: { name: "Start Date/Time Offset Units", datatype: "CE" },
      11: { name: "Duration", datatype: "NM" },
      12: { name: "Duration Units", datatype: "CE" },
      13: { name: "Allow Substitution Code", datatype: "IS" },
      14: { name: "Filler Status Code", datatype: "CE" }
    }
  },
  AIL: {
    name: "Appointment Information - Location Resource",
    fields: {
      1: { name: "Set ID - AIL", datatype: "SI" },
      2: { name: "Segment Action Code", datatype: "ID" },
      3: { name: "Location Resource ID", datatype: "PL" },
      4: { name: "Location Type-AIL", datatype: "CE" },
      5: { name: "Location Group", datatype: "CE" },
      6: { name: "Start Date/Time", datatype: "TS" },
      7: { name: "Start Date/Time Offset", datatype: "NM" },
      8: { name: "Start Date/Time Offset Units", datatype: "CE" },
      9: { name: "Duration", datatype: "NM" },
      10: { name: "Duration Units", datatype: "CE" },
      11: { name: "Allow Substitution Code", datatype: "IS" },
      12: { name: "Filler Status Code", datatype: "CE" }
    }
  },
  AIP: {
    name: "Appointment Information - Personnel Resource",
    fields: {
      1: { name: "Set ID - AIP", datatype: "SI" },
      2: { name: "Segment Action Code", datatype: "ID" },
      3: { name: "Personnel Resource ID", datatype: "XCN" },
      4: { name: "Resource Role", datatype: "CE" },
      5: { name: "Resource Group", datatype: "CE" },
      6: { name: "Start Date/Time", datatype: "TS" },
      7: { name: "Start Date/Time Offset", datatype: "NM" },
      8: { name: "Start Date/Time Offset Units", datatype: "CE" },
      9: { name: "Duration", datatype: "NM" },
      10: { name: "Duration Units", datatype: "CE" },
      11: { name: "Allow Substitution Code", datatype: "IS" },
      12: { name: "Filler Status Code", datatype: "CE" }
    }
  },
  APR: {
    name: "Appointment Preferences",
    fields: {
      1: { name: "Time Selection Criteria", datatype: "SCV" },
      2: { name: "Resource Selection Criteria", datatype: "SCV" },
      3: { name: "Location Selection Criteria", datatype: "SCV" },
      4: { name: "Slot Spacing Criteria", datatype: "NM" },
      5: { name: "Filler Override Criteria", datatype: "SCV" }
    }
  },
  AL1: {
    name: "Patient Allergy Information",
    fields: {
      1: { name: "Set ID - AL1", datatype: "SI" },
      2: { name: "Allergy Type Code", datatype: "CE" },
      3: { name: "Allergy Code/Mnemonic/Description", datatype: "CE" },
      4: { name: "Allergy Severity Code", datatype: "CE" },
      5: { name: "Allergy Reaction Code", datatype: "ST" },
      6: { name: "Identification Date", datatype: "DT" }
    }
  },
  GT1: {
    name: "Guarantor",
    fields: {
      1: { name: "Set ID - GT1", datatype: "SI" },
      2: { name: "Guarantor Number", datatype: "CX" },
      3: { name: "Guarantor Name", datatype: "XPN" },
      4: { name: "Guarantor Spouse Name", datatype: "XPN" },
      5: { name: "Guarantor Address", datatype: "XAD" },
      6: { name: "Guarantor Phone Number - Home", datatype: "XTN" },
      7: { name: "Guarantor Phone Number - Business", datatype: "XTN" },
      8: { name: "Guarantor Date/Time of Birth", datatype: "TS" },
      9: { name: "Guarantor Administrative Sex", datatype: "IS" },
      10: { name: "Guarantor Type", datatype: "IS" },
      11: { name: "Guarantor Relationship", datatype: "CE" }
    }
  }
};
const datatypeComponentNames = {
  CE: {
    1: "Identifier",
    2: "Text",
    3: "Name of Coding System",
    4: "Alternate Identifier",
    5: "Alternate Text",
    6: "Name of Alternate Coding System"
  },
  CWE: {
    1: "Identifier",
    2: "Text",
    3: "Name of Coding System",
    4: "Alternate Identifier",
    5: "Alternate Text",
    6: "Name of Alternate Coding System",
    7: "Coding System Version ID",
    8: "Alternate Coding System Version ID",
    9: "Original Text"
  },
  CX: {
    1: "ID Number",
    2: "Check Digit",
    3: "Check Digit Scheme",
    4: "Assigning Authority",
    5: "Identifier Type Code",
    6: "Assigning Facility",
    7: "Effective Date",
    8: "Expiration Date",
    9: "Assigning Jurisdiction",
    10: "Assigning Agency or Department"
  },
  EI: {
    1: "Entity Identifier",
    2: "Namespace ID",
    3: "Universal ID",
    4: "Universal ID Type"
  },
  HD: {
    1: "Namespace ID",
    2: "Universal ID",
    3: "Universal ID Type"
  },
  PL: {
    1: "Point of Care",
    2: "Room",
    3: "Bed",
    4: "Facility",
    5: "Location Status",
    6: "Person Location Type",
    7: "Building",
    8: "Floor",
    9: "Location Description"
  },
  TS: {
    1: "Time",
    2: "Degree of Precision"
  },
  DTM: {
    1: "Date/Time"
  },
  DR: {
    1: "Range Start Date/Time",
    2: "Range End Date/Time"
  },
  RI: {
    1: "Repeat Pattern",
    2: "Explicit Time Interval"
  },
  SCV: {
    1: "Parameter Class",
    2: "Parameter Value"
  },
  TQ: {
    1: "Quantity",
    2: "Interval",
    3: "Duration",
    4: "Start Date/Time",
    5: "End Date/Time",
    6: "Priority",
    7: "Condition",
    8: "Text",
    9: "Conjunction",
    10: "Order Sequencing"
  },
  XAD: {
    1: "Street Address",
    2: "Other Designation",
    3: "City",
    4: "State or Province",
    5: "Zip or Postal Code",
    6: "Country",
    7: "Address Type",
    8: "Other Geographic Designation",
    9: "County/Parish Code"
  },
  XCN: {
    1: "ID Number",
    2: "Family Name",
    3: "Given Name",
    4: "Second and Further Given Names",
    5: "Suffix",
    6: "Prefix",
    7: "Degree",
    8: "Source Table",
    9: "Assigning Authority",
    10: "Name Type Code",
    11: "Identifier Check Digit",
    12: "Check Digit Scheme",
    13: "Identifier Type Code",
    14: "Assigning Facility",
    15: "Name Representation Code",
    16: "Name Context",
    17: "Name Validity Range",
    18: "Name Assembly Order"
  },
  XPN: {
    1: "Family Name",
    2: "Given Name",
    3: "Second and Further Given Names",
    4: "Suffix",
    5: "Prefix",
    6: "Degree",
    7: "Name Type Code",
    8: "Name Representation Code"
  },
  XTN: {
    1: "Telephone Number",
    2: "Telecommunication Use Code",
    3: "Telecommunication Equipment Type",
    4: "Email Address",
    5: "Country Code",
    6: "Area/City Code",
    7: "Local Number",
    8: "Extension"
  }
};
function getSegmentDefinition(segmentId) {
  if (segmentDefinitions[segmentId]) {
    return segmentDefinitions[segmentId];
  }
  if (/^IN\d+$/.test(segmentId)) {
    return {
      name: "Insurance Segment (Non-standard)",
      fields: {}
    };
  }
  return {
    name: segmentId.startsWith("Z") ? "Custom Segment" : "Unknown Segment",
    fields: {}
  };
}
function getFieldDefinition(segmentId, position) {
  return getSegmentDefinition(segmentId).fields[position] ?? {
    name: `${segmentId}-${position}`
  };
}
function getComponentName(datatype, position) {
  if (!datatype) {
    return `Component ${position}`;
  }
  return datatypeComponentNames[datatype]?.[position] ?? `Component ${position}`;
}
const defaultDelimiters = {
  field: "|",
  component: "^",
  repetition: "~",
  escape: "\\",
  subcomponent: "&"
};
function parseHl7(message) {
  const warnings2 = [];
  const lines = normalizeSegments(message);
  if (lines.length === 0) {
    return {
      delimiters: defaultDelimiters,
      metadata: {},
      warnings: warnings2,
      segments: []
    };
  }
  const delimiters = detectDelimiters(lines[0], warnings2);
  const segments = lines.map((line, index) => parseSegment(line, index + 1, delimiters, warnings2));
  const metadata = extractMetadata(segments);
  return {
    delimiters,
    metadata,
    warnings: warnings2,
    segments
  };
}
function decodeHl7Escapes(value, delimiters) {
  if (value.length === 0) {
    return value;
  }
  const escape = delimiters.escape;
  let decoded = "";
  let index = 0;
  while (index < value.length) {
    if (value[index] !== escape) {
      decoded += value[index];
      index += 1;
      continue;
    }
    const endIndex = value.indexOf(escape, index + 1);
    if (endIndex === -1) {
      decoded += value[index];
      index += 1;
      continue;
    }
    const token = value.slice(index + 1, endIndex);
    decoded += decodeEscapeToken(token, delimiters);
    index = endIndex + 1;
  }
  return decoded;
}
function normalizeSegments(message) {
  return message.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split("\r").map((line) => line.trimEnd()).filter((line) => line.trim().length > 0);
}
function detectDelimiters(firstLine, warnings2) {
  if (!firstLine.startsWith("MSH") || firstLine.length < 8) {
    warnings2.push("No valid MSH segment found. Default HL7 delimiters were used.");
    return defaultDelimiters;
  }
  const field = firstLine.charAt(3);
  const encodingCharacters = firstLine.slice(4, 8);
  return {
    field: field || defaultDelimiters.field,
    component: encodingCharacters.charAt(0) || defaultDelimiters.component,
    repetition: encodingCharacters.charAt(1) || defaultDelimiters.repetition,
    escape: encodingCharacters.charAt(2) || defaultDelimiters.escape,
    subcomponent: encodingCharacters.charAt(3) || defaultDelimiters.subcomponent
  };
}
function parseSegment(line, index, delimiters, warnings2) {
  const parts = splitHl7(line, delimiters.field, delimiters.escape);
  const id = parts[0] || `SEG${index}`;
  const segmentDefinition = getSegmentDefinition(id);
  if (id.length !== 3) {
    warnings2.push(`Segment ${index} has an unexpected identifier: ${id}`);
  }
  return {
    id,
    name: segmentDefinition.name,
    index,
    rawValue: line,
    fields: parseFields(id, parts.slice(1), delimiters)
  };
}
function parseFields(segmentId, rawFields, delimiters) {
  if (segmentId === "MSH") {
    return [
      buildField(segmentId, 1, delimiters.field, delimiters),
      buildField(segmentId, 2, rawFields[0] ?? "", delimiters),
      ...rawFields.slice(1).map((value, index) => buildField(segmentId, index + 3, value, delimiters))
    ];
  }
  return rawFields.map((value, index) => buildField(segmentId, index + 1, value, delimiters));
}
function buildField(segmentId, position, rawValue, delimiters) {
  const definition = getFieldDefinition(segmentId, position);
  return {
    path: `${segmentId}-${position}`,
    name: definition.name,
    datatype: definition.datatype,
    rawValue,
    repetitions: parseRepetitions(`${segmentId}-${position}`, rawValue, definition.datatype, delimiters)
  };
}
function parseRepetitions(fieldPath, rawValue, datatype, delimiters) {
  if (rawValue.length === 0) {
    return [];
  }
  return splitHl7(rawValue, delimiters.repetition, delimiters.escape).map((repetitionValue, repetitionIndex) => {
    const repetitionPath = repetitionIndex === 0 ? fieldPath : `${fieldPath}(${repetitionIndex + 1})`;
    return {
      path: repetitionPath,
      rawValue: repetitionValue,
      components: parseComponents(repetitionPath, repetitionValue, datatype, delimiters)
    };
  });
}
function parseComponents(repetitionPath, rawValue, datatype, delimiters) {
  return splitHl7(rawValue, delimiters.component, delimiters.escape).map((componentValue, index) => {
    const position = index + 1;
    const path = `${repetitionPath}.${position}`;
    return {
      path,
      name: getComponentName(datatype, position),
      rawValue: componentValue,
      subcomponents: parseSubcomponents(path, componentValue, delimiters)
    };
  });
}
function parseSubcomponents(componentPath, rawValue, delimiters) {
  const subcomponents = splitHl7(rawValue, delimiters.subcomponent, delimiters.escape);
  if (subcomponents.length <= 1) {
    return [];
  }
  return subcomponents.map((subcomponentValue, index) => {
    const position = index + 1;
    return {
      path: `${componentPath}.${position}`,
      name: `Subcomponent ${position}`,
      rawValue: subcomponentValue
    };
  });
}
function splitHl7(value, separator, escape) {
  const parts = [];
  let partStart = 0;
  let index = 0;
  while (index < value.length) {
    if (value[index] === escape) {
      const escapeEnd = value.indexOf(escape, index + 1);
      if (escapeEnd === -1) {
        index += 1;
        continue;
      }
      index = escapeEnd + 1;
      continue;
    }
    if (value[index] === separator) {
      parts.push(value.slice(partStart, index));
      partStart = index + 1;
    }
    index += 1;
  }
  parts.push(value.slice(partStart));
  return parts;
}
function decodeEscapeToken(token, delimiters) {
  if (token === "F") {
    return delimiters.field;
  }
  if (token === "S") {
    return delimiters.component;
  }
  if (token === "R") {
    return delimiters.repetition;
  }
  if (token === "T") {
    return delimiters.subcomponent;
  }
  if (token === "E") {
    return delimiters.escape;
  }
  if (token === ".br") {
    return "\n";
  }
  return `${delimiters.escape}${token}${delimiters.escape}`;
}
function extractMetadata(segments) {
  const msh = segments.find((segment) => segment.id === "MSH");
  if (!msh) {
    return {};
  }
  const messageTypeField = msh.fields.find((field) => field.path === "MSH-9");
  const version = msh.fields.find((field) => field.path === "MSH-12")?.rawValue;
  const messageTypeParts = messageTypeField?.repetitions[0]?.components ?? [];
  return {
    messageType: messageTypeParts[0]?.rawValue || messageTypeField?.rawValue || void 0,
    triggerEvent: messageTypeParts[1]?.rawValue || void 0,
    messageStructure: messageTypeParts[2]?.rawValue || void 0,
    version: version || void 0
  };
}
const appIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="HL7 Reader">
  <rect width="64" height="64" rx="16" fill="#151c24"/>
  <path d="M32 9l5.5 13.4L52 23.8 41 33l3.4 14.1L32 39.6 19.6 47.1 23 33 12 23.8l14.5-1.4L32 9z" fill="#5fd0bd"/>
  <path d="M32 18l3.5 8.5 9.2.9-7 5.9 2.2 9-7.9-4.8-7.9 4.8 2.2-9-7-5.9 9.2-.9L32 18z" fill="#ffffff" opacity="0.92"/>
</svg>
`.trim();
const sampleMessage = [
  "MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01|MSG00001|P|2.5",
  "EVN|A01|202405091105",
  "PID|1||123456^^^HOSP^MR||Doe^Jane^A||19800115|F|||123 Main St^^Boston^MA^02118||555-0100",
  "PV1|1|I|3N^301^A^HOSP||||1234^Smith^John|||MED|||||||1234^Smith^John||V12345",
  "OBX|1|NM|8480-6^Systolic blood pressure^LN||120|mmHg|90-120|N|||F"
].join("\r");
const app = document.querySelector("#app");
if (!app) {
  throw new Error("Missing app root");
}
app.innerHTML = `
  <section class="shell">
    <header class="topbar">
      <div>
        <h1><span class="app-mark" aria-hidden="true">${appIconSvg}</span>HL7 Reader</h1>
        <p>Paste an HL7 v2 message to inspect segments, fields, components, and values.</p>
      </div>
      <div class="topbar-actions">
        <label class="toggle">
          <input id="show-empty" type="checkbox" />
          <span>Show empty fields</span>
        </label>
        <button class="icon-button" id="menu-toggle" type="button" aria-label="Toggle menu bar" title="Toggle menu bar">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <section class="input-panel" aria-label="HL7 message input">
      <textarea id="message-input" spellcheck="false"></textarea>
    </section>

    <section class="warnings" id="warnings"></section>
    <section class="tree" id="tree" aria-label="Parsed HL7 output"></section>
  </section>
`;
const input = document.querySelector("#message-input");
const showEmpty = document.querySelector("#show-empty");
const menuToggle = document.querySelector("#menu-toggle");
const warnings = document.querySelector("#warnings");
const tree = document.querySelector("#tree");
if (!input || !showEmpty || !menuToggle || !warnings || !tree) {
  throw new Error("Missing renderer elements");
}
const elements = {
  input,
  showEmpty,
  menuToggle,
  warnings,
  tree
};
const state = {
  parsed: parseHl7(""),
  showEmptyFields: false
};
elements.input.placeholder = sampleMessage;
elements.input.addEventListener("input", () => {
  state.parsed = parseHl7(elements.input.value);
  render();
});
elements.showEmpty.addEventListener("change", () => {
  state.showEmptyFields = elements.showEmpty.checked;
  render();
});
elements.menuToggle.addEventListener("click", () => {
  void window.hl7Reader?.toggleMenuBar();
});
render();
function render() {
  renderWarnings(state.parsed);
  renderTree(state.parsed);
}
function renderWarnings(parsed) {
  elements.warnings.replaceChildren();
  for (const warning of parsed.warnings) {
    const item = document.createElement("div");
    item.className = "warning";
    item.textContent = warning;
    elements.warnings.append(item);
  }
}
function renderTree(parsed) {
  elements.tree.replaceChildren();
  if (parsed.segments.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Paste an HL7 message above to see the parsed structure.";
    elements.tree.append(empty);
    return;
  }
  for (const segment of parsed.segments) {
    elements.tree.append(segmentNode(segment));
  }
}
function segmentNode(segment) {
  const details = document.createElement("details");
  details.className = "node segment";
  const summaryEl = document.createElement("summary");
  summaryEl.append(row(`${segment.id} #${segment.index}`, segment.name, compactPreview(segment.rawValue)));
  details.append(summaryEl);
  const fieldList = document.createElement("div");
  fieldList.className = "children";
  for (const field of segment.fields) {
    if (!state.showEmptyFields && field.rawValue.length === 0) {
      continue;
    }
    fieldList.append(fieldNode(field));
  }
  details.append(fieldList);
  return details;
}
function fieldNode(field) {
  const hasNested = field.repetitions.some((repetition) => repetition.components.length > 1 || repetition.components.some((component) => component.subcomponents.length > 0));
  const container = document.createElement(hasNested ? "details" : "div");
  container.className = `node field ${field.rawValue.length === 0 ? "is-empty" : ""}`;
  const fieldName = field.datatype ? `${field.name} (${field.datatype})` : field.name;
  if (hasNested) {
    const summaryEl = document.createElement("summary");
    summaryEl.append(row(field.path, fieldName, field.rawValue));
    container.append(summaryEl);
    const children = document.createElement("div");
    children.className = "children";
    for (const repetition of field.repetitions) {
      children.append(repetitionNode(repetition));
    }
    container.append(children);
    return container;
  }
  container.append(row(field.path, fieldName, field.rawValue));
  return container;
}
function repetitionNode(repetition) {
  const hasRepeatedPath = /\(\d+\)$/.test(repetition.path);
  const container = document.createElement(hasRepeatedPath ? "details" : "div");
  container.className = "node repetition";
  if (hasRepeatedPath) {
    const summaryEl = document.createElement("summary");
    summaryEl.append(row(repetition.path, "Repetition", repetition.rawValue));
    container.append(summaryEl);
    const children = document.createElement("div");
    children.className = "children";
    appendComponents(children, repetition.components);
    container.append(children);
    return container;
  }
  appendComponents(container, repetition.components);
  return container;
}
function appendComponents(parent, components) {
  for (const component of components) {
    if (!state.showEmptyFields && component.rawValue.length === 0) {
      continue;
    }
    parent.append(componentNode(component));
  }
}
function componentNode(component) {
  if (component.subcomponents.length === 0) {
    const container = document.createElement("div");
    container.className = "node component";
    container.append(row(component.path, component.name, component.rawValue));
    return container;
  }
  const details = document.createElement("details");
  details.className = "node component";
  const summaryEl = document.createElement("summary");
  summaryEl.append(row(component.path, component.name, component.rawValue));
  details.append(summaryEl);
  const children = document.createElement("div");
  children.className = "children";
  for (const subcomponent of component.subcomponents) {
    if (!state.showEmptyFields && subcomponent.rawValue.length === 0) {
      continue;
    }
    children.append(row(subcomponent.path, subcomponent.name, subcomponent.rawValue));
  }
  details.append(children);
  return details;
}
function row(path, name, value) {
  const wrapper = document.createElement("div");
  wrapper.className = "row";
  const pathEl = document.createElement("span");
  pathEl.className = "path";
  pathEl.textContent = path;
  const nameEl = document.createElement("span");
  nameEl.className = "name";
  nameEl.textContent = name;
  const valueEl = document.createElement("span");
  valueEl.className = value.length > 0 ? "value" : "value muted";
  valueEl.textContent = value.length > 0 ? displayValue(value) : "empty";
  wrapper.append(pathEl, nameEl, valueEl);
  return wrapper;
}
function displayValue(value) {
  return decodeHl7Escapes(value, state.parsed.delimiters);
}
function compactPreview(value) {
  const preview = displayValue(value);
  return preview.length > 120 ? `${preview.slice(0, 117)}...` : preview;
}

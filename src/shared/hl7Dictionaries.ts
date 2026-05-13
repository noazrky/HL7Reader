export type SegmentFieldDefinition = {
  name: string
  datatype?: string
}

export type SegmentDefinition = {
  name: string
  fields: Record<number, SegmentFieldDefinition>
}

export const segmentDefinitions: Record<string, SegmentDefinition> = {
  MSH: {
    name: 'Message Header',
    fields: {
      1: { name: 'Field Separator', datatype: 'ST' },
      2: { name: 'Encoding Characters', datatype: 'ST' },
      3: { name: 'Sending Application', datatype: 'HD' },
      4: { name: 'Sending Facility', datatype: 'HD' },
      5: { name: 'Receiving Application', datatype: 'HD' },
      6: { name: 'Receiving Facility', datatype: 'HD' },
      7: { name: 'Date/Time of Message', datatype: 'TS' },
      8: { name: 'Security', datatype: 'ST' },
      9: { name: 'Message Type', datatype: 'MSG' },
      10: { name: 'Message Control ID', datatype: 'ST' },
      11: { name: 'Processing ID', datatype: 'PT' },
      12: { name: 'Version ID', datatype: 'VID' },
      13: { name: 'Sequence Number', datatype: 'NM' },
      14: { name: 'Continuation Pointer', datatype: 'ST' },
      15: { name: 'Accept Acknowledgment Type', datatype: 'ID' },
      16: { name: 'Application Acknowledgment Type', datatype: 'ID' },
      17: { name: 'Country Code', datatype: 'ID' },
      18: { name: 'Character Set', datatype: 'ID' },
      19: { name: 'Principal Language of Message', datatype: 'CE' }
    }
  },
  EVN: {
    name: 'Event Type',
    fields: {
      1: { name: 'Event Type Code', datatype: 'ID' },
      2: { name: 'Recorded Date/Time', datatype: 'TS' },
      3: { name: 'Date/Time Planned Event', datatype: 'TS' },
      4: { name: 'Event Reason Code', datatype: 'IS' },
      5: { name: 'Operator ID', datatype: 'XCN' },
      6: { name: 'Event Occurred', datatype: 'TS' },
      7: { name: 'Event Facility', datatype: 'HD' }
    }
  },
  PID: {
    name: 'Patient Identification',
    fields: {
      1: { name: 'Set ID - PID', datatype: 'SI' },
      2: { name: 'Patient ID', datatype: 'CX' },
      3: { name: 'Patient Identifier List', datatype: 'CX' },
      4: { name: 'Alternate Patient ID', datatype: 'CX' },
      5: { name: 'Patient Name', datatype: 'XPN' },
      6: { name: "Mother's Maiden Name", datatype: 'XPN' },
      7: { name: 'Date/Time of Birth', datatype: 'TS' },
      8: { name: 'Administrative Sex', datatype: 'IS' },
      9: { name: 'Patient Alias', datatype: 'XPN' },
      10: { name: 'Race', datatype: 'CE' },
      11: { name: 'Patient Address', datatype: 'XAD' },
      12: { name: 'County Code', datatype: 'IS' },
      13: { name: 'Phone Number - Home', datatype: 'XTN' },
      14: { name: 'Phone Number - Business', datatype: 'XTN' },
      15: { name: 'Primary Language', datatype: 'CE' },
      16: { name: 'Marital Status', datatype: 'CE' },
      17: { name: 'Religion', datatype: 'CE' },
      18: { name: 'Patient Account Number', datatype: 'CX' },
      19: { name: 'SSN Number - Patient', datatype: 'ST' },
      20: { name: "Driver's License Number - Patient", datatype: 'DLN' },
      21: { name: "Mother's Identifier", datatype: 'CX' },
      22: { name: 'Ethnic Group', datatype: 'CE' },
      23: { name: 'Birth Place', datatype: 'ST' },
      24: { name: 'Multiple Birth Indicator', datatype: 'ID' },
      25: { name: 'Birth Order', datatype: 'NM' },
      26: { name: 'Citizenship', datatype: 'CE' },
      27: { name: 'Veterans Military Status', datatype: 'CE' },
      28: { name: 'Nationality', datatype: 'CE' },
      29: { name: 'Patient Death Date and Time', datatype: 'TS' },
      30: { name: 'Patient Death Indicator', datatype: 'ID' }
    }
  },
  NK1: {
    name: 'Next of Kin / Associated Parties',
    fields: {
      1: { name: 'Set ID - NK1', datatype: 'SI' },
      2: { name: 'Name', datatype: 'XPN' },
      3: { name: 'Relationship', datatype: 'CE' },
      4: { name: 'Address', datatype: 'XAD' },
      5: { name: 'Phone Number', datatype: 'XTN' },
      6: { name: 'Business Phone Number', datatype: 'XTN' },
      7: { name: 'Contact Role', datatype: 'CE' },
      8: { name: 'Start Date', datatype: 'DT' },
      9: { name: 'End Date', datatype: 'DT' },
      10: { name: 'Next of Kin / Associated Parties Job Title', datatype: 'ST' },
      11: { name: 'Next of Kin / Associated Parties Job Code/Class', datatype: 'JCC' },
      12: { name: 'Next of Kin / Associated Parties Employee Number', datatype: 'CX' },
      13: { name: 'Organization Name - NK1', datatype: 'XON' },
      14: { name: 'Marital Status', datatype: 'CE' },
      15: { name: 'Administrative Sex', datatype: 'IS' },
      16: { name: 'Date/Time of Birth', datatype: 'TS' },
      17: { name: 'Living Dependency', datatype: 'IS' },
      18: { name: 'Ambulatory Status', datatype: 'IS' },
      19: { name: 'Citizenship', datatype: 'CE' },
      20: { name: 'Primary Language', datatype: 'CE' },
      21: { name: 'Living Arrangement', datatype: 'IS' },
      22: { name: 'Publicity Code', datatype: 'CE' },
      23: { name: 'Protection Indicator', datatype: 'ID' },
      24: { name: 'Student Indicator', datatype: 'IS' },
      25: { name: 'Religion', datatype: 'CE' },
      26: { name: "Mother's Maiden Name", datatype: 'XPN' },
      27: { name: 'Nationality', datatype: 'CE' },
      28: { name: 'Ethnic Group', datatype: 'CE' },
      29: { name: 'Contact Reason', datatype: 'CE' }
    }
  },
  PV1: {
    name: 'Patient Visit',
    fields: {
      1: { name: 'Set ID - PV1', datatype: 'SI' },
      2: { name: 'Patient Class', datatype: 'IS' },
      3: { name: 'Assigned Patient Location', datatype: 'PL' },
      4: { name: 'Admission Type', datatype: 'IS' },
      5: { name: 'Preadmit Number', datatype: 'CX' },
      6: { name: 'Prior Patient Location', datatype: 'PL' },
      7: { name: 'Attending Doctor', datatype: 'XCN' },
      8: { name: 'Referring Doctor', datatype: 'XCN' },
      9: { name: 'Consulting Doctor', datatype: 'XCN' },
      10: { name: 'Hospital Service', datatype: 'IS' },
      11: { name: 'Temporary Location', datatype: 'PL' },
      12: { name: 'Preadmit Test Indicator', datatype: 'IS' },
      13: { name: 'Readmission Indicator', datatype: 'IS' },
      14: { name: 'Admit Source', datatype: 'IS' },
      15: { name: 'Ambulatory Status', datatype: 'IS' },
      16: { name: 'VIP Indicator', datatype: 'IS' },
      17: { name: 'Admitting Doctor', datatype: 'XCN' },
      18: { name: 'Patient Type', datatype: 'IS' },
      19: { name: 'Visit Number', datatype: 'CX' },
      20: { name: 'Financial Class', datatype: 'FC' },
      44: { name: 'Admit Date/Time', datatype: 'TS' },
      45: { name: 'Discharge Date/Time', datatype: 'TS' }
    }
  },
  PV2: {
    name: 'Patient Visit - Additional Information',
    fields: {
      1: { name: 'Prior Pending Location', datatype: 'PL' },
      2: { name: 'Accommodation Code', datatype: 'CE' },
      3: { name: 'Admit Reason', datatype: 'CE' },
      4: { name: 'Transfer Reason', datatype: 'CE' },
      5: { name: 'Patient Valuables', datatype: 'ST' },
      6: { name: 'Patient Valuables Location', datatype: 'ST' },
      7: { name: 'Visit User Code', datatype: 'IS' },
      8: { name: 'Expected Admit Date/Time', datatype: 'TS' },
      9: { name: 'Expected Discharge Date/Time', datatype: 'TS' },
      10: { name: 'Estimated Length of Inpatient Stay', datatype: 'NM' },
      11: { name: 'Actual Length of Inpatient Stay', datatype: 'NM' },
      12: { name: 'Visit Description', datatype: 'ST' },
      13: { name: 'Referral Source Code', datatype: 'XCN' },
      14: { name: 'Previous Service Date', datatype: 'DT' },
      15: { name: 'Employment Illness Related Indicator', datatype: 'ID' },
      16: { name: 'Purge Status Code', datatype: 'IS' },
      17: { name: 'Purge Status Date', datatype: 'DT' },
      18: { name: 'Special Program Code', datatype: 'IS' },
      19: { name: 'Retention Indicator', datatype: 'ID' },
      20: { name: 'Expected Number of Insurance Plans', datatype: 'NM' },
      21: { name: 'Visit Publicity Code', datatype: 'IS' },
      22: { name: 'Visit Protection Indicator', datatype: 'ID' },
      23: { name: 'Clinic Organization Name', datatype: 'XON' },
      24: { name: 'Patient Status Code', datatype: 'IS' },
      46: { name: 'Patient Status Effective Date', datatype: 'DT' },
      47: { name: 'Expected LOA Return Date/Time', datatype: 'TS' }
    }
  },
  ORC: {
    name: 'Common Order',
    fields: {
      1: { name: 'Order Control', datatype: 'ID' },
      2: { name: 'Placer Order Number', datatype: 'EI' },
      3: { name: 'Filler Order Number', datatype: 'EI' },
      4: { name: 'Placer Group Number', datatype: 'EI' },
      5: { name: 'Order Status', datatype: 'ID' },
      6: { name: 'Response Flag', datatype: 'ID' },
      7: { name: 'Quantity/Timing', datatype: 'TQ' },
      8: { name: 'Parent', datatype: 'CM' },
      9: { name: 'Date/Time of Transaction', datatype: 'TS' },
      10: { name: 'Entered By', datatype: 'XCN' },
      11: { name: 'Verified By', datatype: 'XCN' },
      12: { name: 'Ordering Provider', datatype: 'XCN' },
      13: { name: 'Enterer\'s Location', datatype: 'PL' },
      14: { name: 'Call Back Phone Number', datatype: 'XTN' },
      15: { name: 'Order Effective Date/Time', datatype: 'TS' },
      16: { name: 'Order Control Code Reason', datatype: 'CE' },
      17: { name: 'Entering Organization', datatype: 'CE' },
      18: { name: 'Entering Device', datatype: 'CE' },
      19: { name: 'Action By', datatype: 'XCN' },
      20: { name: 'Advanced Beneficiary Notice Code', datatype: 'CE' },
      21: { name: 'Ordering Facility Name', datatype: 'XON' },
      22: { name: 'Ordering Facility Address', datatype: 'XAD' },
      23: { name: 'Ordering Facility Phone Number', datatype: 'XTN' },
      24: { name: 'Ordering Provider Address', datatype: 'XAD' },
      25: { name: 'Order Status Modifier', datatype: 'CWE' }
    }
  },
  BLG: {
    name: 'Billing',
    fields: {
      1: { name: 'When to Charge', datatype: 'CM' },
      2: { name: 'Charge Type', datatype: 'ID' },
      3: { name: 'Account ID', datatype: 'CX' }
    }
  },
  OBR: {
    name: 'Observation Request',
    fields: {
      1: { name: 'Set ID - OBR', datatype: 'SI' },
      2: { name: 'Placer Order Number', datatype: 'EI' },
      3: { name: 'Filler Order Number', datatype: 'EI' },
      4: { name: 'Universal Service Identifier', datatype: 'CE' },
      5: { name: 'Priority - OBR', datatype: 'ID' },
      6: { name: 'Requested Date/Time', datatype: 'TS' },
      7: { name: 'Observation Date/Time', datatype: 'TS' },
      8: { name: 'Observation End Date/Time', datatype: 'TS' },
      9: { name: 'Collection Volume', datatype: 'CQ' },
      10: { name: 'Collector Identifier', datatype: 'XCN' },
      11: { name: 'Specimen Action Code', datatype: 'ID' },
      12: { name: 'Danger Code', datatype: 'CE' },
      13: { name: 'Relevant Clinical Information', datatype: 'ST' },
      14: { name: 'Specimen Received Date/Time', datatype: 'TS' },
      15: { name: 'Specimen Source', datatype: 'CM' },
      16: { name: 'Ordering Provider', datatype: 'XCN' },
      17: { name: 'Order Callback Phone Number', datatype: 'XTN' },
      18: { name: 'Placer Field 1', datatype: 'ST' },
      19: { name: 'Placer Field 2', datatype: 'ST' },
      20: { name: 'Filler Field 1', datatype: 'ST' },
      21: { name: 'Filler Field 2', datatype: 'ST' },
      22: { name: 'Results Rpt/Status Chng - Date/Time', datatype: 'TS' },
      23: { name: 'Charge to Practice', datatype: 'CM' },
      24: { name: 'Diagnostic Serv Sect ID', datatype: 'ID' },
      25: { name: 'Result Status', datatype: 'ID' },
      26: { name: 'Parent Result', datatype: 'CM' },
      27: { name: 'Quantity/Timing', datatype: 'TQ' },
      28: { name: 'Result Copies to', datatype: 'XCN' },
      29: { name: 'Parent', datatype: 'CM' },
      30: { name: 'Transportation Mode', datatype: 'ID' },
      31: { name: 'Reason for Study', datatype: 'CE' },
      32: { name: 'Principal Result Interpreter', datatype: 'CM' },
      33: { name: 'Assistant Result Interpreter', datatype: 'CM' },
      34: { name: 'Technician', datatype: 'CM' },
      35: { name: 'Transcriptionist', datatype: 'CM' },
      36: { name: 'Scheduled Date/Time', datatype: 'TS' },
      37: { name: 'Number of Sample Containers', datatype: 'NM' },
      38: { name: 'Transport Logistics of Collected Sample', datatype: 'CE' },
      39: { name: 'Collector\'s Comment', datatype: 'CE' },
      40: { name: 'Transport Arrangement Responsibility', datatype: 'CE' },
      41: { name: 'Transport Arranged', datatype: 'ID' },
      42: { name: 'Escort Required', datatype: 'ID' },
      43: { name: 'Planned Patient Transport Comment', datatype: 'CE' },
      44: { name: 'Procedure Code', datatype: 'CE' },
      45: { name: 'Procedure Code Modifier', datatype: 'CE' },
      46: { name: 'Placer Supplemental Service Information', datatype: 'CE' },
      47: { name: 'Filler Supplemental Service Information', datatype: 'CE' }
    }
  },
  ODS: {
    name: 'Dietary Orders, Supplements, and Preferences',
    fields: {
      1: { name: 'Type', datatype: 'ID' },
      2: { name: 'Service Period', datatype: 'CE' },
      3: { name: 'Diet, Supplement, or Preference Code', datatype: 'CE' },
      4: { name: 'Text Instruction', datatype: 'ST' }
    }
  },
  ODT: {
    name: 'Diet Tray Instructions',
    fields: {
      1: { name: 'Tray Type', datatype: 'CE' },
      2: { name: 'Service Period', datatype: 'CE' },
      3: { name: 'Text Instruction', datatype: 'ST' }
    }
  },
  RQD: {
    name: 'Requisition Detail',
    fields: {
      1: { name: 'Requisition Line Number', datatype: 'SI' },
      2: { name: 'Item Code - Internal', datatype: 'CE' },
      3: { name: 'Item Code - External', datatype: 'CE' },
      4: { name: 'Hospital Item Code', datatype: 'CE' },
      5: { name: 'Requisition Quantity', datatype: 'NM' },
      6: { name: 'Requisition Unit of Measure', datatype: 'CE' },
      7: { name: 'Dept. Cost Center', datatype: 'IS' },
      8: { name: 'Item Natural Account Code', datatype: 'IS' },
      9: { name: 'Deliver to ID', datatype: 'CE' },
      10: { name: 'Date Needed', datatype: 'DT' }
    }
  },
  RQ1: {
    name: 'Requisition Detail-1',
    fields: {
      1: { name: 'Anticipated Price', datatype: 'ST' },
      2: { name: 'Manufacturer Identifier', datatype: 'CE' },
      3: { name: 'Manufacturer\'s Catalog', datatype: 'ST' },
      4: { name: 'Vendor ID', datatype: 'CE' },
      5: { name: 'Vendor Catalog', datatype: 'ST' },
      6: { name: 'Taxable', datatype: 'ID' },
      7: { name: 'Substitute Allowed', datatype: 'ID' }
    }
  },
  RXO: {
    name: 'Pharmacy/Treatment Order',
    fields: {
      1: { name: 'Requested Give Code', datatype: 'CE' },
      2: { name: 'Requested Give Amount - Minimum', datatype: 'NM' },
      3: { name: 'Requested Give Amount - Maximum', datatype: 'NM' },
      4: { name: 'Requested Give Units', datatype: 'CE' },
      5: { name: 'Requested Dosage Form', datatype: 'CE' },
      6: { name: 'Provider\'s Pharmacy/Treatment Instructions', datatype: 'CE' },
      7: { name: 'Provider\'s Administration Instructions', datatype: 'CE' },
      8: { name: 'Deliver-to Location', datatype: 'CM' },
      9: { name: 'Allow Substitutions', datatype: 'ID' },
      10: { name: 'Requested Dispense Code', datatype: 'CE' },
      11: { name: 'Requested Dispense Amount', datatype: 'NM' },
      12: { name: 'Requested Dispense Units', datatype: 'CE' },
      13: { name: 'Number of Refills', datatype: 'NM' },
      14: { name: 'Ordering Provider\'s DEA Number', datatype: 'XCN' },
      15: { name: 'Pharmacist/Treatment Supplier\'s Verifier ID', datatype: 'XCN' },
      16: { name: 'Needs Human Review', datatype: 'ID' },
      17: { name: 'Requested Give Per (Time Unit)', datatype: 'ST' },
      18: { name: 'Requested Give Strength', datatype: 'NM' },
      19: { name: 'Requested Give Strength Units', datatype: 'CE' },
      20: { name: 'Indication', datatype: 'CE' },
      21: { name: 'Requested Give Rate Amount', datatype: 'ST' },
      22: { name: 'Requested Give Rate Units', datatype: 'CE' },
      23: { name: 'Total Daily Dose', datatype: 'CQ' },
      24: { name: 'Supplementary Code', datatype: 'CE' }
    }
  },
  RXR: {
    name: 'Pharmacy/Treatment Route',
    fields: {
      1: { name: 'Route', datatype: 'CE' },
      2: { name: 'Administration Site', datatype: 'CE' },
      3: { name: 'Administration Device', datatype: 'CE' },
      4: { name: 'Administration Method', datatype: 'CE' },
      5: { name: 'Routing Instruction', datatype: 'CE' }
    }
  },
  RXC: {
    name: 'Pharmacy/Treatment Component Order',
    fields: {
      1: { name: 'RX Component Type', datatype: 'ID' },
      2: { name: 'Component Code', datatype: 'CE' },
      3: { name: 'Component Amount', datatype: 'NM' },
      4: { name: 'Component Units', datatype: 'CE' },
      5: { name: 'Component Strength', datatype: 'NM' },
      6: { name: 'Component Strength Units', datatype: 'CE' },
      7: { name: 'Supplementary Code', datatype: 'CE' }
    }
  },
  RXE: {
    name: 'Pharmacy/Treatment Encoded Order',
    fields: {
      1: { name: 'Quantity/Timing', datatype: 'TQ' },
      2: { name: 'Give Code', datatype: 'CE' },
      3: { name: 'Give Amount - Minimum', datatype: 'NM' },
      4: { name: 'Give Amount - Maximum', datatype: 'NM' },
      5: { name: 'Give Units', datatype: 'CE' },
      6: { name: 'Give Dosage Form', datatype: 'CE' },
      7: { name: 'Provider\'s Administration Instructions', datatype: 'CE' },
      8: { name: 'Deliver-to Location', datatype: 'CM' },
      9: { name: 'Substitution Status', datatype: 'ID' },
      10: { name: 'Dispense Amount', datatype: 'NM' },
      11: { name: 'Dispense Units', datatype: 'CE' },
      12: { name: 'Number of Refills', datatype: 'NM' },
      13: { name: 'Ordering Provider\'s DEA Number', datatype: 'XCN' },
      14: { name: 'Pharmacist/Treatment Supplier\'s Verifier ID', datatype: 'XCN' },
      15: { name: 'Prescription Number', datatype: 'ST' },
      16: { name: 'Number of Refills Remaining', datatype: 'NM' },
      17: { name: 'Number of Refills/Doses Dispensed', datatype: 'NM' },
      18: { name: 'D/T of Most Recent Refill or Dose Dispensed', datatype: 'TS' },
      19: { name: 'Total Daily Dose', datatype: 'CQ' },
      20: { name: 'Needs Human Review', datatype: 'ID' },
      21: { name: 'Pharmacy/Treatment Supplier\'s Special Dispensing Instructions', datatype: 'CE' },
      22: { name: 'Give Per (Time Unit)', datatype: 'ST' },
      23: { name: 'Give Rate Amount', datatype: 'ST' },
      24: { name: 'Give Rate Units', datatype: 'CE' },
      25: { name: 'Give Strength', datatype: 'NM' },
      26: { name: 'Give Strength Units', datatype: 'CE' },
      27: { name: 'Give Indication', datatype: 'CE' },
      28: { name: 'Dispense Package Size', datatype: 'NM' },
      29: { name: 'Dispense Package Size Unit', datatype: 'CE' },
      30: { name: 'Dispense Package Method', datatype: 'ID' },
      31: { name: 'Supplementary Code', datatype: 'CE' }
    }
  },
  RXD: {
    name: 'Pharmacy/Treatment Dispense',
    fields: {
      1: { name: 'Dispense Sub-ID Counter', datatype: 'NM' },
      2: { name: 'Dispense/Give Code', datatype: 'CE' },
      3: { name: 'Date/Time Dispensed', datatype: 'TS' },
      4: { name: 'Actual Dispense Amount', datatype: 'NM' },
      5: { name: 'Actual Dispense Units', datatype: 'CE' },
      6: { name: 'Actual Dosage Form', datatype: 'CE' },
      7: { name: 'Prescription Number', datatype: 'ST' },
      8: { name: 'Number of Refills Remaining', datatype: 'NM' },
      9: { name: 'Dispense Notes', datatype: 'ST' },
      10: { name: 'Dispensing Provider', datatype: 'XCN' },
      11: { name: 'Substitution Status', datatype: 'ID' },
      12: { name: 'Total Daily Dose', datatype: 'CQ' },
      13: { name: 'Dispense-to Location', datatype: 'CM' },
      14: { name: 'Needs Human Review', datatype: 'ID' },
      15: { name: 'Pharmacy/Treatment Supplier\'s Special Dispensing Instructions', datatype: 'CE' },
      16: { name: 'Actual Strength', datatype: 'NM' },
      17: { name: 'Actual Strength Unit', datatype: 'CE' },
      18: { name: 'Substance Lot Number', datatype: 'ST' },
      19: { name: 'Substance Expiration Date', datatype: 'TS' },
      20: { name: 'Substance Manufacturer Name', datatype: 'CE' },
      21: { name: 'Indication', datatype: 'CE' },
      22: { name: 'Dispense Package Size', datatype: 'NM' },
      23: { name: 'Dispense Package Size Unit', datatype: 'CE' },
      24: { name: 'Dispense Package Method', datatype: 'ID' },
      25: { name: 'Supplementary Code', datatype: 'CE' },
      26: { name: 'Initiating Location', datatype: 'CE' },
      27: { name: 'Packaging/Assembly Location', datatype: 'CE' }
    }
  },
  RXG: {
    name: 'Pharmacy/Treatment Give',
    fields: {
      1: { name: 'Give Sub-ID Counter', datatype: 'NM' },
      2: { name: 'Dispense Sub-ID Counter', datatype: 'NM' },
      3: { name: 'Quantity/Timing', datatype: 'TQ' },
      4: { name: 'Give Code', datatype: 'CE' },
      5: { name: 'Give Amount - Minimum', datatype: 'NM' },
      6: { name: 'Give Amount - Maximum', datatype: 'NM' },
      7: { name: 'Give Units', datatype: 'CE' },
      8: { name: 'Give Dosage Form', datatype: 'CE' },
      9: { name: 'Administration Notes', datatype: 'CE' },
      10: { name: 'Substitution Status', datatype: 'ID' },
      11: { name: 'Dispense-to Location', datatype: 'CM' },
      12: { name: 'Needs Human Review', datatype: 'ID' },
      13: { name: 'Pharmacy/Treatment Supplier\'s Special Administration Instructions', datatype: 'CE' },
      14: { name: 'Give Per (Time Unit)', datatype: 'ST' },
      15: { name: 'Give Rate Amount', datatype: 'ST' },
      16: { name: 'Give Rate Units', datatype: 'CE' },
      17: { name: 'Give Strength', datatype: 'NM' },
      18: { name: 'Give Strength Units', datatype: 'CE' },
      19: { name: 'Substance Lot Number', datatype: 'ST' },
      20: { name: 'Substance Expiration Date', datatype: 'TS' },
      21: { name: 'Substance Manufacturer Name', datatype: 'CE' },
      22: { name: 'Indication', datatype: 'CE' }
    }
  },
  RXA: {
    name: 'Pharmacy/Treatment Administration',
    fields: {
      1: { name: 'Give Sub-ID Counter', datatype: 'NM' },
      2: { name: 'Administration Sub-ID Counter', datatype: 'NM' },
      3: { name: 'Date/Time Start of Administration', datatype: 'TS' },
      4: { name: 'Date/Time End of Administration (if Applies)', datatype: 'TS' },
      5: { name: 'Administered Code', datatype: 'CE' },
      6: { name: 'Administered Amount', datatype: 'NM' },
      7: { name: 'Administered Units', datatype: 'CE' },
      8: { name: 'Administered Dosage Form', datatype: 'CE' },
      9: { name: 'Administration Notes', datatype: 'CE' },
      10: { name: 'Administering Provider', datatype: 'XCN' },
      11: { name: 'Administered-at Location', datatype: 'CM' },
      12: { name: 'Administered Per (Time Unit)', datatype: 'ST' },
      13: { name: 'Administered Strength', datatype: 'NM' },
      14: { name: 'Administered Strength Units', datatype: 'CE' },
      15: { name: 'Substance Lot Number', datatype: 'ST' },
      16: { name: 'Substance Expiration Date', datatype: 'TS' },
      17: { name: 'Substance Manufacturer Name', datatype: 'CE' },
      18: { name: 'Substance/Treatment Refusal Reason', datatype: 'CE' },
      19: { name: 'Indication', datatype: 'CE' },
      20: { name: 'Completion Status', datatype: 'ID' },
      21: { name: 'Action Code - RXA', datatype: 'ID' },
      22: { name: 'System Entry Date/Time', datatype: 'TS' }
    }
  },
  OBX: {
    name: 'Observation/Result',
    fields: {
      1: { name: 'Set ID - OBX', datatype: 'SI' },
      2: { name: 'Value Type', datatype: 'ID' },
      3: { name: 'Observation Identifier', datatype: 'CE' },
      4: { name: 'Observation Sub-ID', datatype: 'ST' },
      5: { name: 'Observation Value', datatype: 'VARIES' },
      6: { name: 'Units', datatype: 'CE' },
      7: { name: 'Reference Range', datatype: 'ST' },
      8: { name: 'Abnormal Flags', datatype: 'IS' },
      9: { name: 'Probability', datatype: 'NM' },
      10: { name: 'Nature of Abnormal Test', datatype: 'ID' },
      11: { name: 'Observation Result Status', datatype: 'ID' },
      12: { name: 'Effective Date of Reference Range', datatype: 'TS' },
      13: { name: 'User Defined Access Checks', datatype: 'ST' },
      14: { name: 'Date/Time of the Observation', datatype: 'TS' },
      15: { name: "Producer's ID", datatype: 'CE' },
      16: { name: 'Responsible Observer', datatype: 'XCN' },
      17: { name: 'Observation Method', datatype: 'CE' }
    }
  },
  NTE: {
    name: 'Notes and Comments',
    fields: {
      1: { name: 'Set ID - NTE', datatype: 'SI' },
      2: { name: 'Source of Comment', datatype: 'ID' },
      3: { name: 'Comment', datatype: 'FT' },
      4: { name: 'Comment Type', datatype: 'CE' }
    }
  },
  DG1: {
    name: 'Diagnosis',
    fields: {
      1: { name: 'Set ID - DG1', datatype: 'SI' },
      2: { name: 'Diagnosis Coding Method', datatype: 'ID' },
      3: { name: 'Diagnosis Code', datatype: 'CE' },
      4: { name: 'Diagnosis Description', datatype: 'ST' },
      5: { name: 'Diagnosis Date/Time', datatype: 'TS' },
      6: { name: 'Diagnosis Type', datatype: 'IS' },
      15: { name: 'Diagnosis Priority', datatype: 'NM' },
      16: { name: 'Diagnosing Clinician', datatype: 'XCN' }
    }
  },
  PR1: {
    name: 'Procedures',
    fields: {
      1: { name: 'Set ID - PR1', datatype: 'SI' },
      2: { name: 'Procedure Coding Method', datatype: 'IS' },
      3: { name: 'Procedure Code', datatype: 'CE' },
      4: { name: 'Procedure Description', datatype: 'ST' },
      5: { name: 'Procedure Date/Time', datatype: 'TS' },
      6: { name: 'Procedure Functional Type', datatype: 'IS' },
      7: { name: 'Procedure Minutes', datatype: 'NM' },
      8: { name: 'Anesthesiologist', datatype: 'XCN' },
      9: { name: 'Anesthesia Code', datatype: 'IS' },
      10: { name: 'Anesthesia Minutes', datatype: 'NM' },
      11: { name: 'Surgeon', datatype: 'XCN' },
      12: { name: 'Procedure Practitioner', datatype: 'XCN' },
      13: { name: 'Consent Code', datatype: 'CE' },
      14: { name: 'Procedure Priority', datatype: 'ID' },
      15: { name: 'Associated Diagnosis Code', datatype: 'CE' },
      16: { name: 'Procedure Code Modifier', datatype: 'CE' },
      17: { name: 'Procedure DRG Type', datatype: 'IS' },
      18: { name: 'Tissue Type Code', datatype: 'CE' }
    }
  },
  ROL: {
    name: 'Role',
    fields: {
      1: { name: 'Role Instance ID', datatype: 'EI' },
      2: { name: 'Action Code', datatype: 'ID' },
      3: { name: 'Role', datatype: 'CE' },
      4: { name: 'Role Person', datatype: 'XCN' },
      5: { name: 'Role Begin Date/Time', datatype: 'TS' },
      6: { name: 'Role End Date/Time', datatype: 'TS' },
      7: { name: 'Role Duration', datatype: 'CE' },
      8: { name: 'Role Action Reason', datatype: 'CE' },
      9: { name: 'Provider Type', datatype: 'CE' },
      10: { name: 'Organization Unit Type', datatype: 'CE' },
      11: { name: 'Office/Home Address', datatype: 'XAD' },
      12: { name: 'Phone', datatype: 'XTN' }
    }
  },
  IN1: {
    name: 'Insurance',
    fields: {
      1: { name: 'Set ID - IN1', datatype: 'SI' },
      2: { name: 'Insurance Plan ID', datatype: 'CE' },
      3: { name: 'Insurance Company ID', datatype: 'CX' },
      4: { name: 'Insurance Company Name', datatype: 'XON' },
      5: { name: 'Insurance Company Address', datatype: 'XAD' },
      6: { name: 'Insurance Co Contact Person', datatype: 'XPN' },
      7: { name: 'Insurance Co Phone Number', datatype: 'XTN' },
      8: { name: 'Group Number', datatype: 'ST' },
      9: { name: 'Group Name', datatype: 'XON' },
      16: { name: 'Name of Insured', datatype: 'XPN' },
      17: { name: "Insured's Relationship to Patient", datatype: 'CE' },
      18: { name: "Insured's Date of Birth", datatype: 'TS' },
      19: { name: "Insured's Address", datatype: 'XAD' },
      36: { name: 'Policy Number', datatype: 'ST' }
    }
  },
  IN2: {
    name: 'Insurance Additional Information',
    fields: {
      1: { name: "Insured's Employee ID", datatype: 'CX' },
      2: { name: "Insured's Social Security Number", datatype: 'ST' },
      3: { name: "Insured's Employer's Name and ID", datatype: 'XCN' },
      4: { name: 'Employer Information Data', datatype: 'IS' },
      5: { name: 'Mail Claim Party', datatype: 'IS' },
      6: { name: 'Medicare Health Ins Card Number', datatype: 'ST' },
      7: { name: 'Medicaid Case Name', datatype: 'XPN' },
      8: { name: 'Medicaid Case Number', datatype: 'ST' },
      9: { name: 'Military Sponsor Name', datatype: 'XPN' },
      10: { name: 'Military ID Number', datatype: 'ST' },
      11: { name: 'Dependent Of Military Recipient', datatype: 'CE' },
      12: { name: 'Military Organization', datatype: 'ST' },
      13: { name: 'Military Station', datatype: 'ST' },
      14: { name: 'Military Service', datatype: 'IS' },
      15: { name: 'Military Rank/Grade', datatype: 'IS' },
      16: { name: 'Military Status', datatype: 'IS' },
      17: { name: 'Military Retire Date', datatype: 'DT' },
      18: { name: 'Military Non-Avail Cert On File', datatype: 'ID' },
      19: { name: 'Baby Coverage', datatype: 'ID' },
      20: { name: 'Combine Baby Bill', datatype: 'ID' },
      21: { name: 'Blood Deductible', datatype: 'ST' },
      22: { name: 'Special Coverage Approval Name', datatype: 'XPN' },
      23: { name: 'Special Coverage Approval Title', datatype: 'ST' },
      24: { name: 'Non-Covered Insurance Code', datatype: 'IS' },
      25: { name: 'Payor ID', datatype: 'CX' },
      26: { name: 'Payor Subscriber ID', datatype: 'CX' },
      27: { name: 'Eligibility Source', datatype: 'IS' },
      28: { name: 'Room Coverage Type/Amount', datatype: 'CM' },
      29: { name: 'Policy Type/Amount', datatype: 'CM' },
      30: { name: 'Daily Deductible', datatype: 'CM' },
      31: { name: 'Living Dependency', datatype: 'IS' },
      32: { name: 'Ambulatory Status', datatype: 'IS' },
      33: { name: 'Citizenship', datatype: 'CE' },
      34: { name: 'Primary Language', datatype: 'CE' },
      35: { name: 'Living Arrangement', datatype: 'IS' },
      36: { name: 'Publicity Code', datatype: 'CE' },
      37: { name: 'Protection Indicator', datatype: 'ID' },
      38: { name: 'Student Indicator', datatype: 'IS' },
      39: { name: 'Religion', datatype: 'CE' },
      40: { name: "Mother's Maiden Name", datatype: 'XPN' },
      41: { name: 'Nationality', datatype: 'CE' },
      42: { name: 'Ethnic Group', datatype: 'CE' },
      43: { name: 'Marital Status', datatype: 'CE' },
      44: { name: "Insured's Employment Start Date", datatype: 'DT' },
      45: { name: 'Employment Stop Date', datatype: 'DT' },
      46: { name: 'Job Title', datatype: 'ST' },
      47: { name: 'Job Code/Class', datatype: 'JCC' },
      48: { name: 'Job Status', datatype: 'IS' },
      49: { name: 'Employer Contact Person Name', datatype: 'XPN' },
      50: { name: 'Employer Contact Person Phone Number', datatype: 'XTN' },
      51: { name: 'Employer Contact Reason', datatype: 'IS' },
      52: { name: "Insured's Contact Person's Name", datatype: 'XPN' },
      53: { name: "Insured's Contact Person Phone Number", datatype: 'XTN' },
      54: { name: "Insured's Contact Person Reason", datatype: 'IS' },
      55: { name: 'Relationship To The Patient Start Date', datatype: 'DT' },
      56: { name: 'Relationship To The Patient Stop Date', datatype: 'DT' },
      57: { name: 'Insurance Co. Contact Reason', datatype: 'IS' },
      58: { name: 'Insurance Co Contact Phone Number', datatype: 'XTN' },
      59: { name: 'Policy Scope', datatype: 'IS' },
      60: { name: 'Policy Source', datatype: 'IS' },
      61: { name: 'Patient Member Number', datatype: 'CX' },
      62: { name: "Guarantor's Relationship To Insured", datatype: 'CE' },
      63: { name: "Insured's Phone Number - Home", datatype: 'XTN' },
      64: { name: "Insured's Employer Phone Number", datatype: 'XTN' },
      65: { name: 'Military Handicapped Program', datatype: 'CE' },
      66: { name: 'Suspend Flag', datatype: 'ID' },
      67: { name: 'Copay Limit Flag', datatype: 'ID' },
      68: { name: 'Stoploss Limit Flag', datatype: 'ID' },
      69: { name: 'Insured Organization Name And ID', datatype: 'XON' },
      70: { name: 'Insured Employer Organization Name And ID', datatype: 'XON' },
      71: { name: 'Race', datatype: 'CE' },
      72: { name: "HCFA Patient's Relationship to Insured", datatype: 'CE' }
    }
  },
  IN3: {
    name: 'Insurance Additional Information, Certification',
    fields: {
      1: { name: 'Set ID - IN3', datatype: 'SI' },
      2: { name: 'Certification Number', datatype: 'CX' },
      3: { name: 'Certified By', datatype: 'XCN' },
      4: { name: 'Certification Required', datatype: 'ID' },
      5: { name: 'Penalty', datatype: 'CM' },
      6: { name: 'Certification Date/Time', datatype: 'TS' },
      7: { name: 'Certification Modify Date/Time', datatype: 'TS' },
      8: { name: 'Operator', datatype: 'XCN' },
      9: { name: 'Certification Begin Date', datatype: 'DT' },
      10: { name: 'Certification End Date', datatype: 'DT' },
      11: { name: 'Days', datatype: 'CM' },
      12: { name: 'Non-Concur Code/Description', datatype: 'CE' },
      13: { name: 'Non-Concur Effective Date/Time', datatype: 'TS' },
      14: { name: 'Physician Reviewer', datatype: 'XCN' },
      15: { name: 'Certification Contact', datatype: 'ST' },
      16: { name: 'Certification Contact Phone Number', datatype: 'XTN' },
      17: { name: 'Appeal Reason', datatype: 'CE' },
      18: { name: 'Certification Agency', datatype: 'CE' },
      19: { name: 'Certification Agency Phone Number', datatype: 'XTN' },
      20: { name: 'Pre-Certification Req/Window', datatype: 'CM' },
      21: { name: 'Case Manager', datatype: 'ST' },
      22: { name: 'Second Opinion Date', datatype: 'DT' },
      23: { name: 'Second Opinion Status', datatype: 'IS' },
      24: { name: 'Second Opinion Documentation Received', datatype: 'IS' },
      25: { name: 'Second Opinion Physician', datatype: 'XCN' }
    }
  },
  ARQ: {
    name: 'Appointment Request',
    fields: {
      1: { name: 'Placer Appointment ID', datatype: 'EI' },
      2: { name: 'Filler Appointment ID', datatype: 'EI' },
      3: { name: 'Occurrence Number', datatype: 'NM' },
      4: { name: 'Placer Group Number', datatype: 'EI' },
      5: { name: 'Schedule ID', datatype: 'CE' },
      6: { name: 'Request Event Reason', datatype: 'CE' },
      7: { name: 'Appointment Reason', datatype: 'CE' },
      8: { name: 'Appointment Type', datatype: 'CE' },
      9: { name: 'Appointment Duration', datatype: 'NM' },
      10: { name: 'Appointment Duration Units', datatype: 'CE' },
      11: { name: 'Requested Start Date/Time Range', datatype: 'DR' },
      12: { name: 'Priority-ARQ', datatype: 'ST' },
      13: { name: 'Repeating Interval', datatype: 'RI' },
      14: { name: 'Repeating Interval Duration', datatype: 'ST' },
      15: { name: 'Placer Contact Person', datatype: 'XCN' },
      16: { name: 'Placer Contact Phone Number', datatype: 'XTN' },
      17: { name: 'Placer Contact Address', datatype: 'XAD' },
      18: { name: 'Placer Contact Location', datatype: 'PL' },
      19: { name: 'Entered By Person', datatype: 'XCN' },
      20: { name: 'Entered By Phone Number', datatype: 'XTN' },
      21: { name: 'Entered By Location', datatype: 'PL' },
      22: { name: 'Parent Placer Appointment ID', datatype: 'EI' },
      23: { name: 'Parent Filler Appointment ID', datatype: 'EI' },
      24: { name: 'Placer Order Number', datatype: 'EI' },
      25: { name: 'Filler Order Number', datatype: 'EI' }
    }
  },
  SCH: {
    name: 'Schedule Activity Information',
    fields: {
      1: { name: 'Placer Appointment ID', datatype: 'EI' },
      2: { name: 'Filler Appointment ID', datatype: 'EI' },
      3: { name: 'Occurrence Number', datatype: 'NM' },
      4: { name: 'Placer Group Number', datatype: 'EI' },
      5: { name: 'Schedule ID', datatype: 'CE' },
      6: { name: 'Event Reason', datatype: 'CE' },
      7: { name: 'Appointment Reason', datatype: 'CE' },
      8: { name: 'Appointment Type', datatype: 'CE' },
      9: { name: 'Appointment Duration', datatype: 'NM' },
      10: { name: 'Appointment Duration Units', datatype: 'CE' },
      11: { name: 'Appointment Timing Quantity', datatype: 'TQ' },
      12: { name: 'Placer Contact Person', datatype: 'XCN' },
      13: { name: 'Placer Contact Phone Number', datatype: 'XTN' },
      14: { name: 'Placer Contact Address', datatype: 'XAD' },
      15: { name: 'Placer Contact Location', datatype: 'PL' },
      16: { name: 'Filler Contact Person', datatype: 'XCN' },
      17: { name: 'Filler Contact Phone Number', datatype: 'XTN' },
      18: { name: 'Filler Contact Address', datatype: 'XAD' },
      19: { name: 'Filler Contact Location', datatype: 'PL' },
      20: { name: 'Entered By Person', datatype: 'XCN' },
      21: { name: 'Entered By Phone Number', datatype: 'XTN' },
      22: { name: 'Entered By Location', datatype: 'PL' },
      23: { name: 'Parent Placer Appointment ID', datatype: 'EI' },
      24: { name: 'Parent Filler Appointment ID', datatype: 'EI' },
      25: { name: 'Filler Status Code', datatype: 'CE' },
      26: { name: 'Placer Order Number', datatype: 'EI' },
      27: { name: 'Filler Order Number', datatype: 'EI' }
    }
  },
  RGS: {
    name: 'Resource Group',
    fields: {
      1: { name: 'Set ID - RGS', datatype: 'SI' },
      2: { name: 'Segment Action Code', datatype: 'ID' },
      3: { name: 'Resource Group ID', datatype: 'CE' }
    }
  },
  AIS: {
    name: 'Appointment Information - Service',
    fields: {
      1: { name: 'Set ID - AIS', datatype: 'SI' },
      2: { name: 'Segment Action Code', datatype: 'ID' },
      3: { name: 'Universal Service Identifier', datatype: 'CE' },
      4: { name: 'Start Date/Time', datatype: 'TS' },
      5: { name: 'Start Date/Time Offset', datatype: 'NM' },
      6: { name: 'Start Date/Time Offset Units', datatype: 'CE' },
      7: { name: 'Duration', datatype: 'NM' },
      8: { name: 'Duration Units', datatype: 'CE' },
      9: { name: 'Allow Substitution Code', datatype: 'IS' },
      10: { name: 'Filler Status Code', datatype: 'CE' },
      11: { name: 'Placer Supplemental Service / Logistical Information', datatype: 'CE' },
      12: { name: 'Filler Supplemental Service / Logistical Information', datatype: 'CE' }
    }
  },
  AIG: {
    name: 'Appointment Information - General Resource',
    fields: {
      1: { name: 'Set ID - AIG', datatype: 'SI' },
      2: { name: 'Segment Action Code', datatype: 'ID' },
      3: { name: 'Resource ID', datatype: 'CE' },
      4: { name: 'Resource Type', datatype: 'CE' },
      5: { name: 'Resource Group', datatype: 'CE' },
      6: { name: 'Resource Quantity', datatype: 'NM' },
      7: { name: 'Resource Quantity Units', datatype: 'CE' },
      8: { name: 'Start Date/Time', datatype: 'TS' },
      9: { name: 'Start Date/Time Offset', datatype: 'NM' },
      10: { name: 'Start Date/Time Offset Units', datatype: 'CE' },
      11: { name: 'Duration', datatype: 'NM' },
      12: { name: 'Duration Units', datatype: 'CE' },
      13: { name: 'Allow Substitution Code', datatype: 'IS' },
      14: { name: 'Filler Status Code', datatype: 'CE' }
    }
  },
  AIL: {
    name: 'Appointment Information - Location Resource',
    fields: {
      1: { name: 'Set ID - AIL', datatype: 'SI' },
      2: { name: 'Segment Action Code', datatype: 'ID' },
      3: { name: 'Location Resource ID', datatype: 'PL' },
      4: { name: 'Location Type-AIL', datatype: 'CE' },
      5: { name: 'Location Group', datatype: 'CE' },
      6: { name: 'Start Date/Time', datatype: 'TS' },
      7: { name: 'Start Date/Time Offset', datatype: 'NM' },
      8: { name: 'Start Date/Time Offset Units', datatype: 'CE' },
      9: { name: 'Duration', datatype: 'NM' },
      10: { name: 'Duration Units', datatype: 'CE' },
      11: { name: 'Allow Substitution Code', datatype: 'IS' },
      12: { name: 'Filler Status Code', datatype: 'CE' }
    }
  },
  AIP: {
    name: 'Appointment Information - Personnel Resource',
    fields: {
      1: { name: 'Set ID - AIP', datatype: 'SI' },
      2: { name: 'Segment Action Code', datatype: 'ID' },
      3: { name: 'Personnel Resource ID', datatype: 'XCN' },
      4: { name: 'Resource Role', datatype: 'CE' },
      5: { name: 'Resource Group', datatype: 'CE' },
      6: { name: 'Start Date/Time', datatype: 'TS' },
      7: { name: 'Start Date/Time Offset', datatype: 'NM' },
      8: { name: 'Start Date/Time Offset Units', datatype: 'CE' },
      9: { name: 'Duration', datatype: 'NM' },
      10: { name: 'Duration Units', datatype: 'CE' },
      11: { name: 'Allow Substitution Code', datatype: 'IS' },
      12: { name: 'Filler Status Code', datatype: 'CE' }
    }
  },
  APR: {
    name: 'Appointment Preferences',
    fields: {
      1: { name: 'Time Selection Criteria', datatype: 'SCV' },
      2: { name: 'Resource Selection Criteria', datatype: 'SCV' },
      3: { name: 'Location Selection Criteria', datatype: 'SCV' },
      4: { name: 'Slot Spacing Criteria', datatype: 'NM' },
      5: { name: 'Filler Override Criteria', datatype: 'SCV' }
    }
  },
  AL1: {
    name: 'Patient Allergy Information',
    fields: {
      1: { name: 'Set ID - AL1', datatype: 'SI' },
      2: { name: 'Allergy Type Code', datatype: 'CE' },
      3: { name: 'Allergy Code/Mnemonic/Description', datatype: 'CE' },
      4: { name: 'Allergy Severity Code', datatype: 'CE' },
      5: { name: 'Allergy Reaction Code', datatype: 'ST' },
      6: { name: 'Identification Date', datatype: 'DT' }
    }
  },
  GT1: {
    name: 'Guarantor',
    fields: {
      1: { name: 'Set ID - GT1', datatype: 'SI' },
      2: { name: 'Guarantor Number', datatype: 'CX' },
      3: { name: 'Guarantor Name', datatype: 'XPN' },
      4: { name: 'Guarantor Spouse Name', datatype: 'XPN' },
      5: { name: 'Guarantor Address', datatype: 'XAD' },
      6: { name: 'Guarantor Phone Number - Home', datatype: 'XTN' },
      7: { name: 'Guarantor Phone Number - Business', datatype: 'XTN' },
      8: { name: 'Guarantor Date/Time of Birth', datatype: 'TS' },
      9: { name: 'Guarantor Administrative Sex', datatype: 'IS' },
      10: { name: 'Guarantor Type', datatype: 'IS' },
      11: { name: 'Guarantor Relationship', datatype: 'CE' }
    }
  }
}

export const datatypeComponentNames: Record<string, Record<number, string>> = {
  CE: {
    1: 'Identifier',
    2: 'Text',
    3: 'Name of Coding System',
    4: 'Alternate Identifier',
    5: 'Alternate Text',
    6: 'Name of Alternate Coding System'
  },
  CWE: {
    1: 'Identifier',
    2: 'Text',
    3: 'Name of Coding System',
    4: 'Alternate Identifier',
    5: 'Alternate Text',
    6: 'Name of Alternate Coding System',
    7: 'Coding System Version ID',
    8: 'Alternate Coding System Version ID',
    9: 'Original Text'
  },
  CM: {
    1: 'Composite Component 1',
    2: 'Composite Component 2',
    3: 'Composite Component 3',
    4: 'Composite Component 4',
    5: 'Composite Component 5',
    6: 'Composite Component 6',
    7: 'Composite Component 7',
    8: 'Composite Component 8',
    9: 'Composite Component 9',
    10: 'Composite Component 10'
  },
  CQ: {
    1: 'Quantity',
    2: 'Units'
  },
  CX: {
    1: 'ID Number',
    2: 'Check Digit',
    3: 'Check Digit Scheme',
    4: 'Assigning Authority',
    5: 'Identifier Type Code',
    6: 'Assigning Facility',
    7: 'Effective Date',
    8: 'Expiration Date',
    9: 'Assigning Jurisdiction',
    10: 'Assigning Agency or Department'
  },
  DLN: {
    1: 'License Number',
    2: 'Issuing State, Province, Country',
    3: 'Expiration Date'
  },
  EI: {
    1: 'Entity Identifier',
    2: 'Namespace ID',
    3: 'Universal ID',
    4: 'Universal ID Type'
  },
  FC: {
    1: 'Financial Class Code',
    2: 'Effective Date'
  },
  HD: {
    1: 'Namespace ID',
    2: 'Universal ID',
    3: 'Universal ID Type'
  },
  JCC: {
    1: 'Job Code',
    2: 'Job Class',
    3: 'Job Description Text'
  },
  MSG: {
    1: 'Message Code',
    2: 'Trigger Event',
    3: 'Message Structure'
  },
  PL: {
    1: 'Point of Care',
    2: 'Room',
    3: 'Bed',
    4: 'Facility',
    5: 'Location Status',
    6: 'Person Location Type',
    7: 'Building',
    8: 'Floor',
    9: 'Location Description'
  },
  PT: {
    1: 'Processing ID',
    2: 'Processing Mode'
  },
  TS: {
    1: 'Time',
    2: 'Degree of Precision'
  },
  DTM: {
    1: 'Date/Time'
  },
  DR: {
    1: 'Range Start Date/Time',
    2: 'Range End Date/Time'
  },
  RI: {
    1: 'Repeat Pattern',
    2: 'Explicit Time Interval'
  },
  SCV: {
    1: 'Parameter Class',
    2: 'Parameter Value'
  },
  TQ: {
    1: 'Quantity',
    2: 'Interval',
    3: 'Duration',
    4: 'Start Date/Time',
    5: 'End Date/Time',
    6: 'Priority',
    7: 'Condition',
    8: 'Text',
    9: 'Conjunction',
    10: 'Order Sequencing'
  },
  VID: {
    1: 'Version ID',
    2: 'Internationalization Code',
    3: 'International Version ID'
  },
  XAD: {
    1: 'Street Address',
    2: 'Other Designation',
    3: 'City',
    4: 'State or Province',
    5: 'Zip or Postal Code',
    6: 'Country',
    7: 'Address Type',
    8: 'Other Geographic Designation',
    9: 'County/Parish Code'
  },
  XCN: {
    1: 'ID Number',
    2: 'Family Name',
    3: 'Given Name',
    4: 'Second and Further Given Names',
    5: 'Suffix',
    6: 'Prefix',
    7: 'Degree',
    8: 'Source Table',
    9: 'Assigning Authority',
    10: 'Name Type Code',
    11: 'Identifier Check Digit',
    12: 'Check Digit Scheme',
    13: 'Identifier Type Code',
    14: 'Assigning Facility',
    15: 'Name Representation Code',
    16: 'Name Context',
    17: 'Name Validity Range',
    18: 'Name Assembly Order'
  },
  XON: {
    1: 'Organization Name',
    2: 'Organization Name Type Code',
    3: 'ID Number',
    4: 'Check Digit',
    5: 'Check Digit Scheme',
    6: 'Assigning Authority',
    7: 'Identifier Type Code',
    8: 'Assigning Facility',
    9: 'Name Representation Code',
    10: 'Organization Identifier'
  },
  XPN: {
    1: 'Family Name',
    2: 'Given Name',
    3: 'Second and Further Given Names',
    4: 'Suffix',
    5: 'Prefix',
    6: 'Degree',
    7: 'Name Type Code',
    8: 'Name Representation Code'
  },
  XTN: {
    1: 'Telephone Number',
    2: 'Telecommunication Use Code',
    3: 'Telecommunication Equipment Type',
    4: 'Email Address',
    5: 'Country Code',
    6: 'Area/City Code',
    7: 'Local Number',
    8: 'Extension'
  }
}

export function getSegmentDefinition(segmentId: string): SegmentDefinition {
  if (segmentDefinitions[segmentId]) {
    return segmentDefinitions[segmentId]
  }

  if (/^IN\d+$/.test(segmentId)) {
    return {
      name: 'Insurance Segment (Non-standard)',
      fields: {}
    }
  }

  return {
    name: segmentId.startsWith('Z') ? 'Custom Segment' : 'Unknown Segment',
    fields: {}
  }
}

export function getFieldDefinition(segmentId: string, position: number): SegmentFieldDefinition {
  return getSegmentDefinition(segmentId).fields[position] ?? {
    name: `${segmentId}-${position}`
  }
}

export function getComponentName(datatype: string | undefined, position: number): string {
  if (!datatype) {
    return `Component ${position}`
  }

  return datatypeComponentNames[datatype]?.[position] ?? `Component ${position}`
}

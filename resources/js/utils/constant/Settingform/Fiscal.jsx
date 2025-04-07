import React, { useState } from "react";
import { Form, Select, DatePicker, Card, Typography } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Text } = Typography;

const fiscalYearOptions = [
    { label: "January to December", startMonth: "01", endMonth: "12" },
    { label: "April to March", startMonth: "04", endMonth: "03" },
    { label: "July to June", startMonth: "07", endMonth: "06" },
    { label: "October to September", startMonth: "10", endMonth: "09" },
];

const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Russian",
    "Arabic", "Hindi", "Urdu", "Portuguese", "Italian", "Dutch", "Korean", "Turkish"
];

const timezones = [
    "UTC", "GMT", "EST", "CST", "MST", "PST", "IST", "CET", "EET", "JST", "AEST", "NZST"
];

const dateFormats = [
    "YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY/DD/MM", "DD/MM/YYYY"
];

const Fiscal = ({ setFiscalData }) => {  // Receive setFiscalData as a prop
    const [fiscalYear, setFiscalYear] = useState(null);
    const [fiscalStartDate, setFiscalStartDate] = useState(null);
    const [fiscalRange, setFiscalRange] = useState("");
    const [language, setLanguage] = useState(null);
    const [timezone, setTimezone] = useState(null);
    const [dateFormat, setDateFormat] = useState(null);

    const handleFiscalYearChange = (value) => {
        const selectedYear = fiscalYearOptions.find((option) => option.label === value);
        const currentYear = dayjs().year();
        const startMonth = parseInt(selectedYear.startMonth, 10);
        const endMonth = parseInt(selectedYear.endMonth, 10);
    
        const startYear = startMonth === 1 ? currentYear : currentYear - 1;
        const endYear = endMonth === 12 ? startYear : startYear + 1;
    
        const calculatedDate = dayjs(`${startYear}-${startMonth}-01`);
    
        setFiscalYear(value);
        setFiscalStartDate(calculatedDate);
        setFiscalRange(`${dayjs().month(startMonth - 1).format("MMMM")} to ${dayjs().month(endMonth - 1).format("MMMM")}`);
    
        // Convert fiscalStartDate to string before dispatching
        setFiscalData({
            fiscalYear: value,
            fiscalStartDate: calculatedDate.format("YYYY-MM-DD"),  // Convert to string format
            fiscalRange,
            language,
            timezone,
            dateFormat
        });
    };
    

    return (
        <Card style={{ maxWidth: "500px", margin: "30px auto", padding: "20px" }}>
            <Form layout="vertical">
                {/* Language Dropdown */}
                <Form.Item label="Select Language">
                    <Select
                        placeholder="Choose Language"
                        style={{ width: "100%" }}
                        onChange={(value) => setLanguage(value)}
                    >
                        {languages.map((lang) => (
                            <Option key={lang} value={lang}>
                                {lang}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Timezone Dropdown */}
                <Form.Item label="Select Timezone">
                    <Select
                        placeholder="Choose Timezone"
                        style={{ width: "100%" }}
                        onChange={(value) => setTimezone(value)}
                    >
                        {timezones.map((tz) => (
                            <Option key={tz} value={tz}>
                                {tz}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Date Format Dropdown */}
                <Form.Item label="Select Date Format">
                    <Select
                        placeholder="Choose Date Format"
                        style={{ width: "100%" }}
                        onChange={(value) => setDateFormat(value)}
                    >
                        {dateFormats.map((format) => (
                            <Option key={format} value={format}>
                                {format}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Fiscal Year Dropdown */}
                <Form.Item label="Fiscal Year">
                    <Select
                        placeholder="Select Fiscal Year"
                        style={{ width: "100%" }}
                        onChange={handleFiscalYearChange}
                    >
                        {fiscalYearOptions.map((option) => (
                            <Option key={option.label} value={option.label}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Fiscal Start Date (Only Date, No Month Selection) */}
                <Form.Item label="Fiscal Start Date">
                    <DatePicker
                        value={fiscalStartDate}
                        style={{ width: "100%" }}
                        format="YYYY-DD"
                        onChange={(date) => setFiscalStartDate(date)}
                        picker="date"
                    />
                </Form.Item>

                {/* Display Selected Fiscal Year Info */}
                {fiscalYear && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <Text strong>Selected Fiscal Year:</Text> {fiscalRange}
                    </div>
                )}

                {/* Display Selected Language */}
                {language && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                        <Text strong>Selected Language:</Text> {language}
                    </div>
                )}

                {/* Display Selected Timezone */}
                {timezone && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                        <Text strong>Selected Timezone:</Text> {timezone}
                    </div>
                )}

                {/* Display Selected Date Format */}
                {dateFormat && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                        <Text strong>Selected Date Format:</Text> {dateFormat}
                    </div>
                )}
            </Form>
        </Card>
    );
};

export default Fiscal;

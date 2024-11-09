import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
    const [selectedMonth, setSelectedMonth] = useState(selectedDate?.getMonth() || new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear());

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateCalendarDays = useCallback(() => {
        const days = [];
        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Add the actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(selectedYear, selectedMonth, i);
            const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

            days.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.dayCell, isSelected && styles.selectedDay]}
                    onPress={() => handleDateSelect(i)}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }
        return days;
    }, [selectedMonth, selectedYear, selectedDate, daysInMonth, firstDayOfMonth]);

    const handleDateSelect = (day) => {
        const newDate = new Date(selectedYear, selectedMonth, day);
        onDateChange(newDate);
        setCurrentDate(newDate);
        setIsVisible(false);
    };

    const changeMonth = (increment) => {
        let newMonth = selectedMonth + increment;
        let newYear = selectedYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    };

    const formatDisplayDate = (date) => {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <View>
            <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setIsVisible(true)}
            >
                <Text style={styles.dateButtonText}>
                    {formatDisplayDate(currentDate)}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity onPress={() => changeMonth(-1)}>
                                <Text style={styles.navigationButton}>←</Text>
                            </TouchableOpacity>
                            <Text style={styles.monthYearText}>
                                {months[selectedMonth]} {selectedYear}
                            </Text>
                            <TouchableOpacity onPress={() => changeMonth(1)}>
                                <Text style={styles.navigationButton}>→</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekDaysContainer}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <Text key={day} style={styles.weekDayText}>{day}</Text>
                            ))}
                        </View>

                        <View style={styles.calendarGrid}>
                            {generateCalendarDays()}
                        </View>

                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    dateButton: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    navigationButton: {
        fontSize: 24,
        padding: 10,
        color: '#007AFF',
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    weekDayText: {
        width: 40,
        textAlign: 'center',
        fontWeight: '500',
        color: '#666',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    selectedDay: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
    },
    selectedDayText: {
        color: 'white',
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});

export default CustomDatePicker;
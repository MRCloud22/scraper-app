interface Appointment {
    date: string;
    time: string;
    treatment: string;
    price: string;
    bookingUrl?: string;
    imageUrl?: string | null;
}

/**
 * Filters out appointments that are in the past.
 * Parses German date format "Mo. 13.01." or "13.01." and compares with current time.
 * 
 * Note: The scraped appointment dates don't include the year, so we use a heuristic
 * to determine the correct year. If the appointment month is more than 6 months 
 * before the current month, we assume it's for the next year. This handles the 
 * common case of scraping in December for January appointments.
 */
export function filterPastAppointments<T extends Appointment>(appointments: T[]): T[] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return appointments.filter(apt => {
        try {
            // Parse German date format "Mo. 13.01." or "13.01."
            const dateParts = apt.date.match(/(\d{2})\.(\d{2})\./);
            if (!dateParts) return true;

            const day = parseInt(dateParts[1], 10);
            const month = parseInt(dateParts[2], 10) - 1; // 0-indexed months
            const [hours, minutes] = apt.time.split(':').map(Number);

            const aptDate = new Date(currentYear, month, day, hours, minutes, 0, 0);

            // Handle year wrap: if the appointment month is more than 6 months
            // before the current month, assume it's for next year.
            // Example: If current month is December (11) and appointment is January (0),
            // the difference is 11, which is > 6, so set year to next year.
            if (month < currentMonth - 6) {
                aptDate.setFullYear(currentYear + 1);
            }

            return aptDate >= now;
        } catch {
            return true; // Show on error to be safe
        }
    });
}

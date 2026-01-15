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

            // Handle year wrap (if scraped in Dec for Jan appointments)
            if (month < currentMonth - 6) {
                aptDate.setFullYear(currentYear + 1);
            }

            return aptDate >= now;
        } catch {
            return true; // Show on error to be safe
        }
    });
}

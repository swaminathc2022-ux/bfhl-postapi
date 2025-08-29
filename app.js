const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to check if a string is a number
function isNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// Helper function to check if a string is alphabetic
function isAlphabet(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// Helper function to check if a string contains special characters
function isSpecialCharacter(str) {
    return !/^[a-zA-Z0-9]+$/.test(str);
}

// POST endpoint for /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { data, full_name, dob } = req.body;

        // Validate input
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
        }

        // Generate user_id from full_name and dob if provided, otherwise use default
        let user_id = "john_doe_17091999"; // Default fallback
        if (full_name && dob) {
            const name = full_name.toLowerCase().replace(/\s+/g, '_');
            user_id = `${name}_${dob}`;
        }

        // Initialize arrays
        let odd_numbers = [];
        let even_numbers = [];
        let alphabets = [];
        let special_characters = [];
        let sum = 0;

        // Process each item in the data array
        data.forEach(item => {
            const str = String(item);
            
            if (isNumber(str)) {
                const num = parseInt(str);
                if (num % 2 === 0) {
                    even_numbers.push(str);
                } else {
                    odd_numbers.push(str);
                }
                sum += num;
            } else if (isAlphabet(str)) {
                alphabets.push(str.toUpperCase());
            } else if (isSpecialCharacter(str)) {
                special_characters.push(str);
            }
        });

        // Create concat_string by sorting all individual characters in descending order
        let allChars = [];
        alphabets.forEach(item => {
            // Split multi-character strings into individual characters
            allChars.push(...item.split(''));
        });
        
        // Sort all characters in descending order and join
        const concat_string = allChars.sort((a, b) => b.localeCompare(a)).join('');

        // Response object
        const response = {
            is_success: true,
            user_id: user_id,
            email: "john@xyz.com", // Replace with your actual email
            roll_number: "ABCD123", // Replace with your actual roll number
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: sum.toString(), // Return sum as string
            concat_string: concat_string
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// GET endpoint for /bfhl (optional - for testing)
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "API is running",
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

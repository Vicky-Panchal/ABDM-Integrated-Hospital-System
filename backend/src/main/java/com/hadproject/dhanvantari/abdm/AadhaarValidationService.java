package com.hadproject.dhanvantari.abdm;

import org.springframework.stereotype.Service;

@Service
public class AadhaarValidationService {

    private final int[][] d = {
            {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
            {1, 2, 3, 4, 0, 6, 7, 8, 9, 5},
            {2, 3, 4, 0, 1, 7, 8, 9, 5, 6},
            {3, 4, 0, 1, 2, 8, 9, 5, 6, 7},
            {4, 0, 1, 2, 3, 9, 5, 6, 7, 8},
            {5, 9, 8, 7, 6, 0, 4, 3, 2, 1},
            {6, 5, 9, 8, 7, 1, 0, 4, 3, 2},
            {7, 6, 5, 9, 8, 2, 1, 0, 4, 3},
            {8, 7, 6, 5, 9, 3, 2, 1, 0, 4},
            {9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
    };

    private final int[][] p = {
            {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
            {1, 5, 7, 6, 2, 8, 3, 0, 9, 4},
            {5, 8, 0, 3, 7, 9, 6, 1, 4, 2},
            {8, 9, 1, 6, 0, 4, 3, 5, 2, 7},
            {9, 4, 5, 3, 1, 2, 6, 8, 7, 0},
            {4, 2, 8, 6, 5, 7, 3, 9, 0, 1},
            {2, 7, 9, 3, 8, 0, 6, 4, 1, 5},
            {7, 0, 4, 6, 9, 1, 3, 2, 5, 8}
    };

    private final int[] inv = {0, 4, 3, 2, 1, 5, 6, 7, 8, 9};

    // converts string or number to an array and inverts it
    public int[] invArray(Object array) {
        if (array instanceof Number) {
            array = String.valueOf(array);
            System.out.println(array + "!!!");
        }
        if (array instanceof String) {
            String str = (String) array;
            array = str.chars().map(Character::getNumericValue).toArray();
            System.out.println(array + "!!!");
        }
        return reverseArray((int[]) array);
    }

    // Reverses the array
    private int[] reverseArray(int[] array) {
        int[] reversedArray = new int[array.length];
        for (int i = 0; i < array.length; i++) {
            reversedArray[array.length - i - 1] = array[i];
        }
        return reversedArray;
    }

    // Generates checksum
    public int generate(int[] array) {
        int c = 0;
        int[] invertedArray = reverseArray(array);
        for (int i = 0; i < invertedArray.length; i++) {
            c = d[c][p[(i + 1) % 8][invertedArray[i]]];
        }
        return inv[c];
    }

    // Validates checksum
    public boolean validate(int[] array) {
        int c = 0;
        int[] invertedArray = invArray(array);
        for (int i = 0; i < invertedArray.length; i++) {
            c = d[c][p[i % 8][invertedArray[i]]];
        }
        return (c == 0);
    }

    // Validates Aadhaar
    public boolean validateAadhaar(String aadhaarString) {
        System.out.println(aadhaarString.length());
        if (aadhaarString.length() != 12) {
            throw new IllegalArgumentException("Aadhaar numbers should be 12 digits in length");
        }
        if (!aadhaarString.matches("\\d+")) {
            throw new IllegalArgumentException("Aadhaar numbers must contain only numbers");
        }
        char[] aadhaarChars = aadhaarString.toCharArray();
        int[] aadhaarArray = new int[12];
        for (int i = 0; i < 12; i++) {
            aadhaarArray[i] = Character.getNumericValue(aadhaarChars[i]);
        }

        int toCheckChecksum = aadhaarArray[11];

        return generate(aadhaarArray) == toCheckChecksum;
    }
}

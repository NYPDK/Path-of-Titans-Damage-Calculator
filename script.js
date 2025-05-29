function calculateDamage() {
    console.log('Calculate function called'); // Debug log
    
    // Get input values
    const attackerWeight = parseFloat(document.getElementById('attackerWeight').value);
    const victimWeight = parseFloat(document.getElementById('victimWeight').value);
    const baseDamage = parseFloat(document.getElementById('baseDamage').value);
    const armor = parseFloat(document.getElementById('armor').value) || 1;
    const victimState = document.getElementById('victimState').value;
    const isCeratopsian = document.getElementById('isCeratopsian').checked;

    // Debug: Log all input values
    console.log('Inputs:', {
        attackerWeight,
        victimWeight,
        baseDamage,
        armor,
        victimState,
        isCeratopsian
    });

    // Validate inputs - Check for NaN and zero values
    if (isNaN(attackerWeight) || isNaN(victimWeight) || isNaN(baseDamage) || 
        attackerWeight <= 0 || victimWeight <= 0 || baseDamage <= 0) {
        alert('Please fill in all required combat stats with valid numbers!');
        console.log('Validation failed');
        return;
    }

    // Calculate weight ratio
    const weightRatio = attackerWeight / victimWeight;

    // Calculate base damage with armor
    const baseDamageCalculated = (weightRatio * baseDamage) / armor;

    // Determine state multiplier
    let stateMultiplier = 1;
    if (victimState === 'sitting') {
        stateMultiplier = 2;
    } else if (victimState === 'sleeping') {
        stateMultiplier = 4;
    }

    // Calculate damage for each location
    const headMultiplier = isCeratopsian ? 1 : 1.2;
    const bodyMultiplier = 1;
    const tailMultiplier = 0.25;

    const headDamage = baseDamageCalculated * headMultiplier * stateMultiplier;
    const bodyDamage = baseDamageCalculated * bodyMultiplier * stateMultiplier;
    const tailDamage = baseDamageCalculated * tailMultiplier * stateMultiplier;

    // Debug: Log calculated values
    console.log('Calculated values:', {
        weightRatio,
        baseDamageCalculated,
        stateMultiplier,
        headDamage,
        bodyDamage,
        tailDamage
    });

    // Check if elements exist before trying to update them
    const elements = {
        weightRatio: document.getElementById('weightRatio'),
        baseDamageResult: document.getElementById('baseDamageResult'),
        stateMultiplier: document.getElementById('stateMultiplier'),
        headDamage: document.getElementById('headDamage'),
        bodyDamage: document.getElementById('bodyDamage'),
        tailDamage: document.getElementById('tailDamage'),
        headMultiplier: document.getElementById('headMultiplier'),
        results: document.getElementById('results')
    };

    // Check if all elements exist
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element not found: ${key}`);
            return;
        }
    }

    // Display results
    elements.weightRatio.textContent = weightRatio.toFixed(3);
    elements.baseDamageResult.textContent = baseDamageCalculated.toFixed(2);
    elements.stateMultiplier.textContent = stateMultiplier + 'x';
    
    elements.headDamage.textContent = headDamage.toFixed(1);
    elements.bodyDamage.textContent = bodyDamage.toFixed(1);
    elements.tailDamage.textContent = tailDamage.toFixed(1);

    // Update head multiplier text if Ceratopsian
    elements.headMultiplier.textContent = 
        isCeratopsian ? '1x Standard Hit (Armored)' : '1.2x Critical Hit';

    // Show results section
    elements.results.classList.add('show');
    console.log('Results should now be visible');

    // Scroll to results
    elements.results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Allow Enter key to calculate
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculateDamage();
    }
});

// Also add click event listener as backup (in case onclick attribute doesn't work)
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateDamage);
        console.log('Click event listener added to calculate button');
    } else {
        console.error('Calculate button not found');
    }
});

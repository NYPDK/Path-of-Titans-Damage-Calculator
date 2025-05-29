function calculateDamage() {
    console.log('Calculate function called'); // Debug log
      // Get input values
    const attackerWeight = parseFloat(document.getElementById('attackerWeight').value);
    const victimWeight = parseFloat(document.getElementById('victimWeight').value);
    const baseDamage = parseFloat(document.getElementById('baseDamage').value);
    const armor = parseFloat(document.getElementById('armor').value) || 1;
    const victimHealth = parseFloat(document.getElementById('victimHealth').value);
    const victimState = document.getElementById('victimState').value;
    const isCeratopsian = document.getElementById('isCeratopsian').checked;
    const bleedValue = parseFloat(document.getElementById('bleedValue')?.value) || 0;    // Debug: Log all input values
    console.log('Inputs:', {
        attackerWeight,
        victimWeight,
        baseDamage,
        armor,
        victimHealth,
        victimState,
        isCeratopsian,
        bleedValue
    });

    // Validate inputs - Check for NaN and zero values
    if (isNaN(attackerWeight) || isNaN(victimWeight) || isNaN(baseDamage) || 
        attackerWeight <= 0 || victimWeight <= 0 || baseDamage <= 0) {
        alert('Please fill in all required combat stats with valid numbers!');
        console.log('Validation failed');
        return;
    }

    // Validate victim health if provided
    if (!isNaN(victimHealth) && victimHealth <= 0) {
        alert('Victim health must be a positive number!');
        console.log('Health validation failed');
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
    }    // Calculate damage for each location
    const headMultiplier = isCeratopsian ? 1 : 1.2;
    const bodyMultiplier = 1;
    const tailMultiplier = 0.25;

    const headDamage = baseDamageCalculated * headMultiplier * stateMultiplier;
    const bodyDamage = baseDamageCalculated * bodyMultiplier * stateMultiplier;
    const tailDamage = baseDamageCalculated * tailMultiplier * stateMultiplier;

    // Calculate health percentages and hits to kill if health is provided
    let headHealthPercentage = null, bodyHealthPercentage = null, tailHealthPercentage = null;
    let headHitsToKill = null, bodyHitsToKill = null, tailHitsToKill = null;
    
    if (!isNaN(victimHealth) && victimHealth > 0) {
        headHealthPercentage = (headDamage / victimHealth) * 100;
        bodyHealthPercentage = (bodyDamage / victimHealth) * 100;
        tailHealthPercentage = (tailDamage / victimHealth) * 100;
        
        headHitsToKill = Math.ceil(victimHealth / headDamage);
        bodyHitsToKill = Math.ceil(victimHealth / bodyDamage);
        tailHitsToKill = Math.ceil(victimHealth / tailDamage);
    }    // BLEED CALCULATION
    // Only calculate if a bleed value is provided
    let bleedInflicted = 0, bleedHealRate = 0.1, bleedDPS = 0, bleedDuration = 0, bleedTotal = 0;
    // Default heal rate is 0.1 per sec (can be adjusted if needed)
    // State multipliers for healing: sitting=2x, sleeping=4x, trotting=0.5x, sprinting=0.25x (not used here)
    if (bleedValue > 0) {
        bleedInflicted = weightRatio * bleedValue;
        // Adjust heal rate for state
        let healRate = bleedHealRate;
        if (victimState === 'sitting') healRate *= 2;
        if (victimState === 'sleeping') healRate *= 4;
        // Bleed DPS is equal to bleedInflicted per second
        bleedDPS = bleedInflicted;
        // Duration is how long it takes to heal all bleed (stacking not considered here)
        bleedDuration = bleedInflicted / healRate;
        // Total damage = bleedDPS * duration (bleed drains health every second)
        bleedTotal = bleedDPS * bleedDuration;
        // Clamp to victim health if needed
        if (!isNaN(victimHealth) && victimHealth > 0 && bleedTotal > victimHealth) {
            bleedTotal = victimHealth;
        }
    }    // Debug: Log calculated values
    console.log('Calculated values:', {
        weightRatio,
        baseDamageCalculated,
        stateMultiplier,
        headDamage,
        bodyDamage,
        tailDamage,
        headHealthPercentage,
        bodyHealthPercentage,
        tailHealthPercentage,
        headHitsToKill,
        bodyHitsToKill,
        tailHitsToKill,
        bleedInflicted,
        bleedDPS,
        bleedTotal,
        bleedDuration
    });    // Check if elements exist before trying to update them
    const elements = {
        weightRatio: document.getElementById('weightRatio'),
        baseDamageResult: document.getElementById('baseDamageResult'),
        stateMultiplier: document.getElementById('stateMultiplier'),
        headDamage: document.getElementById('headDamage'),
        bodyDamage: document.getElementById('bodyDamage'),
        tailDamage: document.getElementById('tailDamage'),
        headMultiplier: document.getElementById('headMultiplier'),
        headHealthPercentage: document.getElementById('headHealthPercentage'),
        bodyHealthPercentage: document.getElementById('bodyHealthPercentage'),
        tailHealthPercentage: document.getElementById('tailHealthPercentage'),
        headHitsToKill: document.getElementById('headHitsToKill'),
        bodyHitsToKill: document.getElementById('bodyHitsToKill'),
        tailHitsToKill: document.getElementById('tailHitsToKill'),
        results: document.getElementById('results'),
        bleedInflicted: document.getElementById('bleedInflicted'),
        bleedDPS: document.getElementById('bleedDPS'),
        bleedTotal: document.getElementById('bleedTotal'),
        bleedDuration: document.getElementById('bleedDuration')
    };

    // Check if all elements exist
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element not found: ${key}`);
            return;
        }
    }    // Display results
    elements.weightRatio.textContent = weightRatio.toFixed(3);
    elements.baseDamageResult.textContent = baseDamageCalculated.toFixed(2);
    elements.stateMultiplier.textContent = stateMultiplier + 'x';
    
    elements.headDamage.textContent = headDamage.toFixed(1);
    elements.bodyDamage.textContent = bodyDamage.toFixed(1);
    elements.tailDamage.textContent = tailDamage.toFixed(1);

    // Update head multiplier text if Ceratopsian
    elements.headMultiplier.textContent = 
        isCeratopsian ? '1x Standard Hit (Armored)' : '1.2x Critical Hit';

    // Update health information if health is provided
    if (!isNaN(victimHealth) && victimHealth > 0) {
        elements.headHealthPercentage.textContent = headHealthPercentage.toFixed(1) + '% Health';
        elements.bodyHealthPercentage.textContent = bodyHealthPercentage.toFixed(1) + '% Health';
        elements.tailHealthPercentage.textContent = tailHealthPercentage.toFixed(1) + '% Health';
        
        elements.headHitsToKill.textContent = headHitsToKill + ' Hits to Kill';
        elements.bodyHitsToKill.textContent = bodyHitsToKill + ' Hits to Kill';
        elements.tailHitsToKill.textContent = tailHitsToKill + ' Hits to Kill';
    } else {
        // Hide health info if no health provided
        elements.headHealthPercentage.textContent = '';
        elements.bodyHealthPercentage.textContent = '';
        elements.tailHealthPercentage.textContent = '';
        
        elements.headHitsToKill.textContent = '';
        elements.bodyHitsToKill.textContent = '';
        elements.tailHitsToKill.textContent = '';
    }

    // Display Bleed results
    if (bleedValue > 0) {
        elements.bleedInflicted.textContent = bleedInflicted.toFixed(2);
        elements.bleedDPS.textContent = bleedDPS.toFixed(2);
        elements.bleedTotal.textContent = bleedTotal > 0 ? bleedTotal.toFixed(2) : '-';
        elements.bleedDuration.textContent = bleedDuration > 0 ? bleedDuration.toFixed(1) + ' sec' : '-';
    } else {
        elements.bleedInflicted.textContent = '-';
        elements.bleedDPS.textContent = '-';
        elements.bleedTotal.textContent = '-';
        elements.bleedDuration.textContent = '-';
    }

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

function calculateDamage() {
    // Get input values
    const attackerWeight = parseFloat(document.getElementById('attackerWeight').value);
    const victimWeight = parseFloat(document.getElementById('victimWeight').value);
    const baseDamage = parseFloat(document.getElementById('baseDamage').value);
    const armor = parseFloat(document.getElementById('armor').value) || 1;
    const victimState = document.getElementById('victimState').value;
    const isCeratopsian = document.getElementById('isCeratopsian').checked;

    // Validate inputs
    if (!attackerWeight || !victimWeight || !baseDamage) {
        alert('Please fill in all required combat stats!');
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

    // Display results
    document.getElementById('weightRatio').textContent = weightRatio.toFixed(3);
    document.getElementById('baseDamageResult').textContent = baseDamageCalculated.toFixed(2);
    document.getElementById('stateMultiplier').textContent = stateMultiplier + 'x';
    
    document.getElementById('headDamage').textContent = headDamage.toFixed(1);
    document.getElementById('bodyDamage').textContent = bodyDamage.toFixed(1);
    document.getElementById('tailDamage').textContent = tailDamage.toFixed(1);

    // Update head multiplier text if Ceratopsian
    document.getElementById('headMultiplier').textContent = 

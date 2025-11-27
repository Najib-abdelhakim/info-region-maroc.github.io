// DONNÉES SOCIOLOGIQUES INTÉGRÉES DIRECTEMENT
const SOCIOLOGIQUE_DATA = {
  "2025": {
    "Tanger-Tétouan-Al Hoceïma": {
      "population": 3970000,
      "densite": 230.0,
      "superficie": 17262,
      "superficie_pourcentage": 2.43,
      "population_pourcentage": 10.38,
      "subdivisions": 149,
      "provinces": 8,
      "densite_par_province": 28.75,
      "taille_moyenne_communes": 26644
    },
    "L'Oriental": {
      "population": 2570000,
      "densite": 28.51,
      "superficie": 90127,
      "superficie_pourcentage": 12.6,
      "population_pourcentage": 6.71,
      "subdivisions": 147,
      "provinces": 8,
      "densite_par_province": 3.56,
      "taille_moyenne_communes": 17483
    },
    "Fès-Meknès": {
      "population": 4680000,
      "densite": 116.78,
      "superficie": 40075,
      "superficie_pourcentage": 5.64,
      "population_pourcentage": 12.29,
      "subdivisions": 194,
      "provinces": 9,
      "densite_par_province": 12.98,
      "taille_moyenne_communes": 24124
    },
    "Rabat-Salé-Kénitra": {
      "population": 5080000,
      "densite": 279.18,
      "superficie": 18194,
      "superficie_pourcentage": 2.56,
      "population_pourcentage": 13.29,
      "subdivisions": 114,
      "provinces": 7,
      "densite_par_province": 39.88,
      "taille_moyenne_communes": 44561
    },
    "Béni Mellal-Khénifra": {
      "population": 2790000,
      "densite": 68.0,
      "superficie": 41033,
      "superficie_pourcentage": 5.77,
      "population_pourcentage": 7.3,
      "subdivisions": 164,
      "provinces": 5,
      "densite_par_province": 13.6,
      "taille_moyenne_communes": 17012
    },
    "Casablanca-Settat": {
      "population": 7570000,
      "densite": 389.21,
      "superficie": 19448,
      "superficie_pourcentage": 2.74,
      "population_pourcentage": 19.84,
      "subdivisions": 153,
      "provinces": 9,
      "densite_par_province": 43.25,
      "taille_moyenne_communes": 49477
    },
    "Marrakech-Safi": {
      "population": 4980000,
      "densite": 127.14,
      "superficie": 39167,
      "superficie_pourcentage": 5.51,
      "population_pourcentage": 13.04,
      "subdivisions": 251,
      "provinces": 8,
      "densite_par_province": 15.89,
      "taille_moyenne_communes": 19841
    },
    "Drâa-Tafilalet": {
      "population": 1810000,
      "densite": 15.65,
      "superficie": 115592,
      "superficie_pourcentage": 16.25,
      "population_pourcentage": 4.74,
      "subdivisions": 109,
      "provinces": 5,
      "densite_par_province": 3.13,
      "taille_moyenne_communes": 16606
    },
    "Souss-Massa": {
      "population": 2940000,
      "densite": 54.66,
      "superficie": 53789,
      "superficie_pourcentage": 7.57,
      "population_pourcentage": 7.7,
      "subdivisions": 175,
      "provinces": 6,
      "densite_par_province": 9.11,
      "taille_moyenne_communes": 16800
    },
    "Guelmim-Oued Noun": {
      "population": 460000,
      "densite": 9.98,
      "superficie": 46108,
      "superficie_pourcentage": 6.49,
      "population_pourcentage": 1.2,
      "subdivisions": 53,
      "provinces": 4,
      "densite_par_province": 2.5,
      "taille_moyenne_communes": 8679
    },
    "Laâyoune-Sakia El Hamra": {
      "population": 378000,
      "densite": 2.7,
      "superficie": 140018,
      "superficie_pourcentage": 19.7,
      "population_pourcentage": 0.99,
      "subdivisions": 20,
      "provinces": 4,
      "densite_par_province": 0.68,
      "taille_moyenne_communes": 18900
    },
    "Dakhla-Oued Ed-Dahab": {
      "population": 130000,
      "densite": 0.99,
      "superficie": 130898,
      "superficie_pourcentage": 18.41,
      "population_pourcentage": 0.34,
      "subdivisions": 13,
      "provinces": 2,
      "densite_par_province": 0.5,
      "taille_moyenne_communes": 10000
    }
  }
};

class MoroccoDataVisualization {
    constructor() {
        this.config = {
            width: 1000,
            height: 650,
            colors: {
                default: '#4a90e2',
                hover: '#2c5aa0',
                selected: '#e74c3c',
                noData: '#cccccc'
            }
        };

        // CHARGEMENT DIRECT DES DONNÉES
        this.currentData = SOCIOLOGIQUE_DATA["2025"];
        this.currentIndicator = "population";
        this.selectedRegion = null;
        this.regionsTopology = null;
        this.populationFilter = 0;

        // Initialiser les éléments DOM
        this.mapSvg = d3.select("#map");
        this.regionInfo = d3.select("#region-info");
        this.indicateurSelect = d3.select("#indicateur");
        this.dataTable = d3.select("#data-table");
        this.resetBtn = d3.select("#reset-btn");
        this.exportBtn = d3.select("#export-btn");
        this.themeToggle = d3.select("#theme-toggle");
        this.populationFilterInput = d3.select("#filtre-population");
        this.populationValue = d3.select("#population-value");

        this.charts = {
            bar: null,
            radar: null,
            pie: null,
            scatter: null,
            trend: null
        };

        this.init();
    }

    async init() {
        this.showLoadingState();
        await this.loadData();
        this.initializeMap(this.regionsTopology);
        this.calculateAdditionalMetrics();
        this.initializeCharts();
        this.initializeDataTable();
        this.setupEventListeners();
        this.hideLoadingState();
    }

    showLoadingState() {
        this.mapSvg.html(`
            <div class="loading-spinner">
                Chargement des données sociologiques...
            </div>
        `);
    }

    hideLoadingState() {
        this.mapSvg.select('.loading-spinner').remove();
    }

    async loadData() {
        try {
            console.log("Chargement des données...");
            
            // CHARGER SEULEMENT LA TOPOLOGIE DEPUIS LE CDN
            const topology = await d3.json('https://cdn.jsdelivr.net/npm/morocco-map/data/regions.json');
            
            console.log("Topologie chargée:", topology);
            console.log("Données sociologiques intégrées:", this.currentData);

            this.regionsTopology = topology;
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            this.showError("Impossible de charger la carte. Vérifiez votre connexion internet.");
            await this.loadFallbackData();
        }
    }

    async loadFallbackData() {
        // Données de démonstration minimales pour la topologie
        this.regionsTopology = await this.createMinimalTopology();
    }

    getSampleData() {
        return {
            "Tanger-Tétouan-Al Hoceïma": { population: 3970000, densite: 230.0, superficie: 17262, superficie_pourcentage: 2.43, population_pourcentage: 10.38, subdivisions: 149, provinces: 8 },
            "L'Oriental": { population: 2570000, densite: 28.51, superficie: 90127, superficie_pourcentage: 12.6, population_pourcentage: 6.71, subdivisions: 147, provinces: 8 },
            "Fès-Meknès": { population: 4680000, densite: 116.78, superficie: 40075, superficie_pourcentage: 5.64, population_pourcentage: 12.29, subdivisions: 194, provinces: 9 }
        };
    }

    calculateAdditionalMetrics() {
        Object.keys(this.currentData).forEach(region => {
            const data = this.currentData[region];
            // Ces calculs sont déjà dans les données, mais on les garde au cas où
            if (!data.densite_par_province) {
                data.densite_par_province = data.provinces > 0 ? 
                    (data.population / data.provinces) / (data.superficie / data.provinces) : 0;
            }
            if (!data.taille_moyenne_communes) {
                data.taille_moyenne_communes = data.subdivisions > 0 ? 
                    data.population / data.subdivisions : 0;
            }
        });
    }

    initializeMap(topology) {
        const regions = topojson.feature(topology, topology.objects.regions);
        
        const svg = this.mapSvg
            .append("svg")
            .attr("width", this.config.width)
            .attr("height", this.config.height);
        
        const projection = d3.geoMercator()
            .fitSize([this.config.width, this.config.height], regions);
        
        const pathGenerator = d3.geoPath().projection(projection);
        
        // Créer les régions
        svg.selectAll('.region')
            .data(regions.features)
            .enter()
            .append('path')
            .attr('class', 'region')
            .attr('d', pathGenerator)
            .attr('data-region', d => d.properties['name:en'])
            .style('fill', d => {
                const regionName = this.getFrenchRegionName(d.properties['name:en']);
                return this.getColorForRegion(regionName);
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => this.handleRegionHover(event, d))
            .on('mouseout', (event, d) => this.handleRegionMouseOut(event, d))
            .on('click', (event, d) => this.handleRegionClick(event, d));
        
        // Ajouter les labels
        svg.selectAll('.region-label')
            .data(regions.features)
            .enter()
            .append('text')
            .attr('class', 'region-label')
            .attr('transform', d => `translate(${pathGenerator.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.7)')
            .style('pointer-events', 'none')
            .text(d => {
                const regionName = this.getFrenchRegionName(d.properties['name:en']);
                return this.abbreviateRegionName(regionName);
            });
    }

    handleRegionHover(event, d) {
        const regionName = this.getFrenchRegionName(d.properties['name:en']);
        this.showRegionInfo(regionName, event);
        d3.select(event.currentTarget).style('fill', this.config.colors.hover);
    }

    handleRegionMouseOut(event, d) {
        const regionName = this.getFrenchRegionName(d.properties['name:en']);
        if (this.selectedRegion !== regionName) {
            d3.select(event.currentTarget).style('fill', this.getColorForRegion(regionName));
        }
        this.hideRegionInfo();
    }

    handleRegionClick(event, d) {
        const regionName = this.getFrenchRegionName(d.properties['name:en']);
        this.selectRegion(regionName);
    }

    getFrenchRegionName(englishName) {
    const mapping = {
        "Tanger-Tetouan-Al Hoceima": "Tanger-Tétouan-Al Hoceïma",
        "Oriental": "L'Oriental", 
        "Fes-Meknes": "Fès-Meknès",
        "Rabat-Sale-Kenitra": "Rabat-Salé-Kénitra",
        "Beni Mellal-Khenifra": "Béni Mellal-Khénifra", 
        "Grand Casablanca-Settat": "Casablanca-Settat",
        "Marrakech-Safi": "Marrakech-Safi",
        "Draa-Tafilalet": "Drâa-Tafilalet",
        "Souss-Massa": "Souss-Massa",
        "Guelmim-Oued Noun": "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra": "Laâyoune-Sakia El Hamra",
        "Dakhla-Oued Ed-Dahab": "Dakhla-Oued Ed-Dahab"
    };
    
    console.log("Mapping de:", englishName, "vers:", mapping[englishName]);
    
    let frenchName = mapping[englishName];
    
    // Si le mapping direct ne fonctionne pas, essayer une correspondance partielle
    if (!frenchName) {
        console.log("Mapping direct échoué, recherche partielle...");
        for (const [en, fr] of Object.entries(mapping)) {
            if (englishName.toLowerCase().includes(en.toLowerCase())) {
                frenchName = fr;
                console.log("Correspondance partielle trouvée:", en, "->", fr);
                break;
            }
        }
    }
    
    // Si toujours pas trouvé, utiliser le nom anglais
    if (!frenchName) {
        frenchName = englishName;
        console.log("Utilisation du nom anglais:", frenchName);
    }
    
    // Vérifier si le nom français existe dans les données
    if (!this.currentData[frenchName]) {
        console.log("Recherche de correspondance dans les données pour:", frenchName);
        // Chercher une correspondance approximative
        for (const dataKey in this.currentData) {
            const dataKeyLower = dataKey.toLowerCase();
            const frenchNameLower = frenchName.toLowerCase();
            
            if (dataKeyLower.includes(frenchNameLower) || 
                frenchNameLower.includes(dataKeyLower) ||
                this.areNamesSimilar(dataKey, frenchName)) {
                console.log("Correspondance trouvée dans données:", dataKey, "pour", frenchName);
                return dataKey;
            }
        }
        console.warn("Aucune correspondance trouvée dans les données pour:", frenchName);
    } else {
        console.log("Correspondance directe trouvée:", frenchName);
    }
    
    return frenchName;
    }

// Nouvelle méthode pour comparer les similarités entre noms
areNamesSimilar(name1, name2) {
    const cleanName1 = name1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName2 = name2.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return cleanName1.includes(cleanName2) || cleanName2.includes(cleanName1);
}

    getColorForRegion(regionName) {
        if (!this.currentData[regionName] || this.isRegionFiltered(regionName)) {
            return this.config.colors.noData;
        }
        
        const value = this.currentData[regionName][this.currentIndicator];
        
        if (value === undefined || value === null) {
            return this.config.colors.noData;
        }
        
        const maxValue = this.getMaxValue(this.currentIndicator);
        
        if (maxValue === 0) return this.config.colors.default;
        
        let normalizedValue;
        
        if (this.currentIndicator.includes('pourcentage')) {
            normalizedValue = value / 100;
        } else if (this.currentIndicator === 'densite') {
            normalizedValue = Math.log10(value + 1) / Math.log10(maxValue + 1);
        } else {
            normalizedValue = value / maxValue;
        }
        
        return d3.interpolateBlues(normalizedValue);
    }

    isRegionFiltered(regionName) {
        if (this.populationFilter === 0) return false;
        const population = this.currentData[regionName]?.population || 0;
        return population < this.populationFilter;
    }

    getMaxValue(indicator) {
        const values = Object.values(this.currentData)
            .filter(region => region && region[indicator] !== undefined && !this.isRegionFiltered(region))
            .map(region => region[indicator]);
        
        return values.length > 0 ? Math.max(...values) : 1;
    }

    showRegionInfo(regionName, event) {
        if (!this.currentData[regionName]) {
            const infoHtml = `
                <h3>${regionName}</h3>
                <div class="info-stats">
                    <div style="color: #e74c3c;">
                        <strong>Données non disponibles</strong>
                    </div>
                </div>
            `;
            
            this.regionInfo.html(infoHtml)
                .style('display', 'block');
            return;
        }
        
        const data = this.currentData[regionName];
        const infoHtml = `
            <h3>${regionName}</h3>
            <div class="info-stats">
                <div><strong>Population:</strong> <span>${data.population?.toLocaleString()} hab.</span></div>
                <div><strong>Densité:</strong> <span>${data.densite?.toFixed(2)} hab/km²</span></div>
                <div><strong>Superficie:</strong> <span>${data.superficie?.toLocaleString()} km²</span></div>
                <div><strong>Population % :</strong> <span>${data.population_pourcentage}</span></div>
                <div><strong>Superficie % :</strong> <span>${data.superficie_pourcentage}</span></div>
                <div><strong>Communes:</strong> <span>${data.subdivisions}</span></div>
                <div><strong>Provinces:</strong> <span>${data.provinces}</span></div>
                ${data.densite_par_province ? `<div><strong>Densité/province:</strong> <span>${data.densite_par_province.toFixed(2)}</span></div>` : ''}
                ${data.taille_moyenne_communes ? `<div><strong>Taille moyenne communes:</strong> <span>${Math.round(data.taille_moyenne_communes).toLocaleString()} hab.</span></div>` : ''}
            </div>
        `;
        
        this.regionInfo.html(infoHtml).style('display', 'block');
    }

    hideRegionInfo() {
        this.regionInfo.style('display', 'none');
    }

    selectRegion(regionName) {
        this.selectedRegion = regionName;
        this.updateVisualization();
        
        // Animation de feedback
        const regionElement = this.mapSvg.select(`.region[data-region="${this.getEnglishRegionName(regionName)}"]`);
        regionElement
            .transition()
            .duration(200)
            .attr('transform', 'scale(1.02)')
            .transition()
            .duration(200)
            .attr('transform', 'scale(1)');
    }

    getEnglishRegionName(frenchName) {
        const mapping = {
            "Tanger-Tétouan-Al Hoceïma": "Tanger-Tetouan-Al Hoceima",
            "L'Oriental": "Oriental",
            "Fès-Meknès": "Fes-Meknes",
            "Rabat-Salé-Kénitra": "Rabat-Sale-Kenitra",
            "Béni Mellal-Khénifra": "Beni Mellal-Khenifra",
            "Casablanca-Settat": "Grand Casablanca-Settat",
            "Marrakech-Safi": "Marrakech-Safi",
            "Drâa-Tafilalet": "Draa-Tafilalet",
            "Souss-Massa": "Souss-Massa",
            "Guelmim-Oued Noun": "Guelmim-Oued Noun",
            "Laâyoune-Sakia El Hamra": "Laâyoune-Sakia El Hamra",
            "Dakhla-Oued Ed-Dahab": "Dakhla-Oued Ed-Dahab"
        };
        
        return mapping[frenchName] || frenchName;
    }

    initializeCharts() {
        this.createBarChart();
        this.createRadarChart();
        this.createPieChart();
        this.createScatterChart();
        this.createTrendChart();
    }

    createBarChart() {
        const ctx = document.getElementById('barChart').getContext('2d');
        const regions = this.getFilteredRegions();
        const values = regions.map(region => this.currentData[region][this.currentIndicator]);
        
        if (this.charts.bar) this.charts.bar.destroy();
        
        // Configuration avancée pour le bar chart
        const isPercentage = this.currentIndicator.includes('pourcentage');
        const isDensity = this.currentIndicator === 'densite';
        
        this.charts.bar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regions.map(name => this.abbreviateRegionName(name)),
                datasets: [{
                    label: this.getIndicatorLabel(this.currentIndicator),
                    data: values,
                    backgroundColor: regions.map(region => 
                        region === this.selectedRegion ? 
                        '#e74c3c' : 
                        this.getColorByValue(this.currentData[region][this.currentIndicator], this.currentIndicator)
                    ),
                    borderColor: regions.map(region => 
                        region === this.selectedRegion ? '#c0392b' : '#2c5aa0'
                    ),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: this.getIndicatorLabel(this.currentIndicator),
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: { 
                        ticks: { 
                            maxRotation: 45, 
                            minRotation: 45,
                            font: { size: 11 }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: { 
                    legend: { 
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                let formattedValue = value.toLocaleString();
                                
                                if (isPercentage) {
                                    formattedValue = value + '%';
                                } else if (isDensity) {
                                    formattedValue = value.toFixed(2) + ' hab/km²';
                                } else if (this.currentIndicator === 'population') {
                                    formattedValue = this.formatLargeNumber(value) + ' hab';
                                } else if (this.currentIndicator === 'superficie') {
                                    formattedValue = value.toLocaleString() + ' km²';
                                }
                                
                                return `${this.getIndicatorLabel(this.currentIndicator)}: ${formattedValue}`;
                            },
                            afterLabel: (context) => {
                                const regionName = regions[context.dataIndex];
                                if (regionName === this.selectedRegion) {
                                    return '📍 Région sélectionnée';
                                }
                                return null;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                }
            }
        });
    }

    createRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const indicators = ['population', 'densite', 'superficie', 'population_pourcentage', 'subdivisions', 'provinces'];
    
    if (this.charts.radar) this.charts.radar.destroy();
    
    const datasets = [];
    const filteredRegions = this.getFilteredRegions();
    
    // Adapter dynamiquement le nombre de régions affichées
    const maxRegions = Math.min(filteredRegions.length, 6); // Augmenté à 6 régions max
    
    if (this.selectedRegion && this.currentData[this.selectedRegion]) {
        // Mode comparaison avec région sélectionnée
        const otherRegions = filteredRegions
            .filter(region => region !== this.selectedRegion)
            .sort((a, b) => this.currentData[b].population - this.currentData[a].population)
            .slice(0, maxRegions - 1);
        
        // Ajouter la région sélectionnée
        datasets.push({
            label: this.abbreviateRegionName(this.selectedRegion),
            data: indicators.map(ind => this.normalizeValue(this.currentData[this.selectedRegion][ind], ind)),
            borderColor: '#e74c3c',
            backgroundColor: this.hexToRgba('#e74c3c', 0.3),
            borderWidth: 4,
            pointBackgroundColor: '#e74c3c',
            pointBorderColor: '#fff',
            pointHoverRadius: 8,
            pointRadius: 5,
            tension: 0.1 // Courbes plus lisses
        });
        
        // Ajouter les autres régions
        otherRegions.forEach((region, index) => {
            datasets.push({
                label: this.abbreviateRegionName(region),
                data: indicators.map(ind => this.normalizeValue(this.currentData[region][ind], ind)),
                borderColor: this.getColorByIndex(index),
                backgroundColor: this.hexToRgba(this.getColorByIndex(index), 0.1),
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: this.getColorByIndex(index),
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointRadius: 3,
                tension: 0.1
            });
        });
    } else {
        // Mode vue d'ensemble - prendre les régions les plus peuplées
        const topRegions = filteredRegions
            .sort((a, b) => this.currentData[b].population - this.currentData[a].population)
            .slice(0, maxRegions);
            
        topRegions.forEach((region, index) => {
            datasets.push({
                label: this.abbreviateRegionName(region),
                data: indicators.map(ind => this.normalizeValue(this.currentData[region][ind], ind)),
                borderColor: this.getColorByIndex(index),
                backgroundColor: this.hexToRgba(this.getColorByIndex(index), 0.2),
                borderWidth: 3,
                pointBackgroundColor: this.getColorByIndex(index),
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointRadius: 4,
                tension: 0.1
            });
        });
    }
    
    // Si aucune région après filtrage, afficher un message
    if (datasets.length === 0) {
        this.showRadarNoDataMessage(ctx);
        return;
    }
    
    this.charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: indicators.map(ind => this.getIndicatorLabel(ind)),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            scales: { 
                r: { 
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: true, // Afficher les ticks
                        stepSize: 20,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    angleLines: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        },
                        color: 'rgba(0,0,0,0.8)',
                        padding: 15
                    }
                } 
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { 
                            size: filteredRegions.length > 4 ? 10 : 12 // Taille adaptative
                        },
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.raw;
                            const indicator = indicators[context.dataIndex];
                            const originalValue = this.denormalizeValue(value, indicator);
                            
                            let formattedValue = originalValue.toLocaleString();
                            if (indicator.includes('pourcentage')) {
                                formattedValue = originalValue.toFixed(1) + '%';
                            } else if (indicator === 'densite') {
                                formattedValue = originalValue.toFixed(2) + ' hab/km²';
                            } else if (indicator === 'population') {
                                formattedValue = this.formatLargeNumber(originalValue) + ' hab';
                            } else if (indicator === 'superficie') {
                                formattedValue = originalValue.toLocaleString() + ' km²';
                            }
                            
                            return `${context.dataset.label}: ${formattedValue}`;
                        }
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1 // Courbes plus lisses
                }
            }
        }
    });
}

    createPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (this.charts.pie) this.charts.pie.destroy();
    
    const regions = this.getFilteredRegions()
        .sort((a, b) => this.currentData[b].population - this.currentData[a].population);
    
    // AUGMENTER la limite d'affichage des régions
    let displayRegions = regions;
    let othersData = null;
    
    // Augmenter de 8 à 12 régions maximum
    if (regions.length > 12) {
        const mainRegions = regions.slice(0, 11); // 11 régions principales
        const otherRegions = regions.slice(11);
        const otherPopulation = otherRegions.reduce((sum, region) => 
            sum + this.currentData[region].population, 0);
        
        displayRegions = [...mainRegions, 'Autres régions'];
        othersData = otherPopulation;
    }
    
    this.charts.pie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: displayRegions.map(name => 
                name === 'Autres régions' ? name : this.abbreviateRegionName(name)
            ),
            datasets: [{
                data: displayRegions.map(region => 
                    region === 'Autres régions' ? 
                    othersData : 
                    this.currentData[region].population
                ),
                backgroundColor: displayRegions.map((region, index) => 
                    region === 'Autres régions' ? 
                    '#95a5a6' : 
                    this.getColorByIndex(index)
                ),
                borderColor: 'white',
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%', // Réduit pour plus d'espace
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1200
            },
            plugins: { 
                legend: { 
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 12,
                        font: { size: 10 }, // Taille réduite pour plus d'éléments
                        generateLabels: (chart) => {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / this.getTotalPopulation()) * 100).toFixed(1);
                                    
                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor,
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed;
                            const percentage = ((value / this.getTotalPopulation()) * 100).toFixed(1);
                            return `${this.formatLargeNumber(value)} habitants (${percentage}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                }
            }
        }
    });
}

    createScatterChart() {
        const ctx = document.getElementById('scatterChart').getContext('2d');
        if (this.charts.scatter) this.charts.scatter.destroy();
        
        const dataPoints = this.getFilteredRegions()
            .map(region => ({
                x: this.currentData[region].densite,
                y: this.currentData[region].population_pourcentage,
                region: region,
                population: this.currentData[region].population,
                superficie: this.currentData[region].superficie
            }));
        
        this.charts.scatter = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Régions',
                    data: dataPoints,
                    backgroundColor: dataPoints.map(point => 
                        point.region === this.selectedRegion ? 
                        '#e74c3c' : 
                        this.hexToRgba(this.getColorByValue(point.population, 'population'), 0.8)
                    ),
                    borderColor: dataPoints.map(point => 
                        point.region === this.selectedRegion ? '#c0392b' : '#2c5aa0'
                    ),
                    borderWidth: 2,
                    pointRadius: dataPoints.map(point => 
                        point.region === this.selectedRegion ? 
                        10 : 
                        Math.max(5, Math.sqrt(point.population) / 80000)
                    ),
                    pointHoverRadius: dataPoints.map(point => 
                        point.region === this.selectedRegion ? 12 : 8
                    )
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    x: { 
                        type: 'logarithmic',
                        title: { 
                            display: true, 
                            text: 'Densité (hab/km²) - Échelle logarithmique',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: { 
                        title: { 
                            display: true, 
                            text: '% de la Population Nationale',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw;
                                return [
                                    point.region,
                                    `Densité: ${point.x.toFixed(2)} hab/km²`,
                                    `Population: ${point.y}% nationale`,
                                    `Habitants: ${point.population.toLocaleString()}`,
                                    `Superficie: ${point.superficie.toLocaleString()} km²`
                                ];
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        if (this.charts.trend) this.charts.trend.destroy();

        const regions = this.getFilteredRegions()
            .sort((a, b) => this.currentData[b].population - this.currentData[a].population);
        
        // Préparer les données pour le graphique à barres groupées
        this.charts.trend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regions.map(name => this.abbreviateRegionName(name)),
                datasets: [
                    {
                        label: 'Densité (hab/km²)',
                        data: regions.map(region => this.currentData[region].densite),
                        backgroundColor: this.hexToRgba('#3498db', 0.8),
                        borderColor: '#2980b9',
                        borderWidth: 2,
                        yAxisID: 'y',
                        order: 2
                    },
                    {
                        label: 'Taille Moyenne Communes (hab)',
                        data: regions.map(region => this.currentData[region].taille_moyenne_communes),
                        type: 'line',
                        borderColor: '#e74c3c',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointBackgroundColor: '#e74c3c',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: 'y1',
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Densité (hab/km²)'
                        },
                        grid: {
                            color: 'rgba(52, 152, 219, 0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Taille Moyenne Communes (hab)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            callback: function(value) {
                                return value >= 1000 ? (value/1000).toFixed(0) + 'k' : value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 0) {
                                    label += context.parsed.y.toFixed(2) + ' hab/km²';
                                } else {
                                    label += Math.round(context.parsed.y).toLocaleString() + ' hab';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    getFilteredRegions() {
        return Object.keys(this.currentData).filter(region => 
            this.currentData[region] && !this.isRegionFiltered(region)
        );
    }

    initializeDataTable() {
        this.updateDataTable();
    }

    updateDataTable() {
        const regionsData = this.getFilteredRegions()
            .sort((a, b) => this.currentData[b].population - this.currentData[a].population);
        
        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Région</th>
                        <th>Population</th>
                        <th>Densité</th>
                        <th>Superficie</th>
                        <th>Pop</th>
                        <th>Sup</th>
                        <th>Communes</th>
                        <th>Provinces</th>
                    </tr>
                </thead>
                <tbody>
                    ${regionsData.map((region) => `
                        <tr class="${region === this.selectedRegion ? 'selected' : ''}" 
                            onclick="app.selectRegion('${region}')"
                            style="cursor: pointer;">
                            <td><strong>${region}</strong></td>
                            <td>${this.currentData[region].population.toLocaleString()}</td>
                            <td>${this.currentData[region].densite.toFixed(2)}</td>
                            <td>${this.currentData[region].superficie.toLocaleString()}</td>
                            <td>${this.currentData[region].population_pourcentage}%</td>
                            <td>${this.currentData[region].superficie_pourcentage}%</td>
                            <td>${this.currentData[region].subdivisions}</td>
                            <td>${this.currentData[region].provinces}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        this.dataTable.html(tableHtml);
    }

    setupEventListeners() {
        // Changement d'indicateur
        this.indicateurSelect.on('change', () => {
            this.currentIndicator = this.indicateurSelect.node().value;
            this.updateVisualization();
        });
        
        // Filtre de population
        this.populationFilterInput.on('input', () => {
            this.populationFilter = parseInt(this.populationFilterInput.node().value);
            const maxPopulation = 8000000;
            const percentage = (this.populationFilter / maxPopulation) * 100;
            
            if (this.populationFilter === 0) {
                this.populationValue.text('Toutes les régions');
            } else {
                this.populationValue.text(`> ${(this.populationFilter / 1000000).toFixed(1)}M habitants (${percentage.toFixed(0)}%)`);
            }
            
            this.updateVisualization();
        });
        
        // Réinitialisation
        this.resetBtn.on('click', () => {
            this.resetSelection();
        });
        
        // Export des données
        this.exportBtn.on('click', () => {
            this.exportData();
        });
        
        // Thème sombre/clair
        this.themeToggle.on('click', () => {
            this.toggleTheme();
        });
        
        // Navigation au clavier
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.resetSelection();
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-theme');
        this.themeToggle.text(isDark ? '' : '');
        
        // Mettre à jour les graphiques
        this.updateCharts();
    }

    exportData() {
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'donnees-regions-maroc-2025.json';
        link.click();
        
        this.showNotification('Données exportées avec succès!', 'success');
    }

    updateVisualization() {
        // Mettre à jour la carte
        this.mapSvg.selectAll('.region')
            .style('fill', d => {
                const engName = d.properties['name:en'];
                const frName = this.getFrenchRegionName(engName);
                return this.getColorForRegion(frName);
            });
        
        if (this.selectedRegion) {
            this.mapSvg.selectAll('.region')
                .filter(d => {
                    const engName = d.properties['name:en'];
                    const name = this.getFrenchRegionName(engName);
                    return name === this.selectedRegion;
                })
                .style('fill', this.config.colors.selected);
        }
        
        this.updateCharts();
        this.updateDataTable();
    }

    updateCharts() {
        this.createBarChart();
        this.createRadarChart();
        this.createPieChart();
        this.createScatterChart();
        this.createTrendChart();
    }

    resetSelection() {
        this.selectedRegion = null;
        this.mapSvg.selectAll('.region')
            .style('fill', d => {
                const engName = d.properties['name:en'];
                const frName = this.getFrenchRegionName(engName);
                return this.getColorForRegion(frName);
            });
        
        this.updateCharts();
        this.updateDataTable();
        this.hideRegionInfo();
        
        this.showNotification('Sélection réinitialisée', 'info');
    }

    getIndicatorLabel(indicator) {
        const labels = {
            'population': 'Population',
            'densite': 'Densité (hab/km²)',
            'superficie': 'Superficie (km²)',
            'population_pourcentage': 'Population %',
            'superficie_pourcentage': 'Superficie %',
            'subdivisions': 'Communes',
            'provinces': 'Provinces',
            'densite_par_province': 'Densité par Province',
            'taille_moyenne_communes': 'Taille Moyenne des Communes'
        };
        return labels[indicator] || indicator;
    }

    getColorByIndex(index) {
        const colors = ['#4a90e2', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[index % colors.length];
    }

    getColorByValue(value, indicator) {
        const maxValue = this.getMaxValue(indicator);
        const normalized = value / maxValue;
        
        // Échelle de couleurs séquentielle
        if (normalized < 0.2) return '#d4efdf';
        if (normalized < 0.4) return '#a9dfbf';
        if (normalized < 0.6) return '#7dcea0';
        if (normalized < 0.8) return '#52be80';
        return '#27ae60';
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    normalizeValue(value, indicator) {
        const maxValue = this.getMaxValue(indicator);
        return maxValue > 0 ? (value / maxValue) * 100 : 0;
    }

    denormalizeValue(normalizedValue, indicator) {
        const maxValue = this.getMaxValue(indicator);
        return (normalizedValue / 100) * maxValue;
    }

    abbreviateRegionName(fullName) {
        const abbreviations = {
            "Tanger-Tétouan-Al Hoceïma": "Tanger-Tét.",
            "L'Oriental": "Oriental",
            "Rabat-Salé-Kénitra": "Rabat-Salé",
            "Béni Mellal-Khénifra": "Béni Mellal", 
            "Casablanca-Settat": "Casablanca",
            "Marrakech-Safi": "Marrakech",
            "Drâa-Tafilalet": "Drâa-Taf.",
            "Souss-Massa": "Souss-Massa",
            "Guelmim-Oued Noun": "Guelmim",
            "Laâyoune-Sakia El Hamra": "Laâyoune", 
            "Dakhla-Oued Ed-Dahab": "Dakhla"
        };
        return abbreviations[fullName] || fullName.substring(0, 10);
    }

    formatLargeNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.', ',') + 'k';
        }
        return num.toString();
    }

    getTotalPopulation() {
        return this.getFilteredRegions()
            .reduce((total, region) => total + this.currentData[region].population, 0);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = d3.select('body')
            .append('div')
            .style('position', 'fixed')
            .style('top', '20px')
            .style('left', '50%')
            .style('transform', 'translateX(-50%)')
            .style('background', type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db')
            .style('color', 'white')
            .style('padding', '1rem 2rem')
            .style('border-radius', '8px')
            .style('z-index', '1000')
            .style('box-shadow', '0 4px 15px rgba(0,0,0,0.2)')
            .text(message);
        
        setTimeout(() => notification.remove(), 3000);
    }

    createMinimalTopology() {
        // Topologie minimale pour la démonstration
        return {
            type: "Topology",
            objects: {
                regions: {
                    type: "GeometryCollection",
                    geometries: [
                        {
                            type: "Polygon",
                            properties: { "name:en": "Tanger-Tetouan-Al Hoceima" },
                            coordinates: [[[0,0], [1,0], [1,1], [0,1], [0,0]]]
                        }
                    ]
                }
            }
        };
    }
}

// Initialiser l'application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new MoroccoDataVisualization();
});

// Exposer globalement pour les callbacks HTML
window.selectRegion = (regionName) => {
    if (app) {
        app.selectRegion(regionName);
    }
};
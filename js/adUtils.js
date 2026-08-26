const KCG_AD_CONFIG = {
    enabled: false,
    publisherId: ""
};

function initializeKcgAdSlots() {
    const pageAudience =
        document.body.dataset.pageAudience ||
        "general";

    const adsAllowedOnPage =
        pageAudience === "general" ||
        pageAudience === "teacher";

    const showAds =
        KCG_AD_CONFIG.enabled &&
        adsAllowedOnPage;

    document
        .querySelectorAll(".kcg-ad-slot")
        .forEach(slot => {
            slot.hidden = !showAds;

            if (showAds) {
                slot.setAttribute(
                    "aria-label",
                    "Advertisement"
                );
            }
        });
}

document.addEventListener(
    "DOMContentLoaded",
    initializeKcgAdSlots
);
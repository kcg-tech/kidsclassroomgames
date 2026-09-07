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
            const slotEnabled = showAds && !slot.hasAttribute("data-ad-pending");
            slot.hidden = !slotEnabled;

            if (slotEnabled) {
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

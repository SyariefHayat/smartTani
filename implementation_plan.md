# Component Rename — Professional Naming Convention

Menghapus konteks folder yang redundan dan suffix `Section` dari nama file komponen. Folder sudah menyediakan konteks, jadi nama file tidak perlu mengulangnya.

## Prinsip

1. **Folder = konteks** → `about/Hero.tsx` bukan `about/HeroAboutSection.tsx`
2. **Hapus suffix `Section`** → `Hero.tsx` bukan `HeroSection.tsx`
3. **Nama singkat & deskriptif** → `CTA.tsx` bukan `CTABannerAboutSection.tsx`
4. **Komponen detail page tidak di-rename** — file seperti `CourseHero.tsx`, `ProductCard.tsx`, `InvestmentDetailHero.tsx` sudah clean karena mereka bukan section utama

## Execution Order

Build setelah setiap page selesai: `npm run build`

---

## 1. `components/sections/home/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `HeroSection.tsx` | `Hero.tsx` | `HeroSection` | `Hero` |
| `StatsBarSection.tsx` | `StatsBar.tsx` | `StatsBarSection` | `StatsBar` |
| `FeatureSection.tsx` | `Features.tsx` | `FeatureSection` | `Features` |
| `StepsSection.tsx` | `Steps.tsx` | `StepsSection` | `Steps` |
| `TestimonialSection.tsx` | `Testimonials.tsx` | `TestimonialSection` | `Testimonials` |
| `CTABannerSection.tsx` | `CTA.tsx` | `CTABannerSection` | `CTA` |
| `StatItem.tsx` | *(no change)* | `StatItem` | *(no change)* |

**Affected imports:**
- `app/(main)/page.tsx` — 6 imports
- `components/sections/investments/InvestmentStatsBarSection.tsx` → imports `StatItem` (path stays same, no change)

---

## 2. `components/sections/about/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `HeroAboutSection.tsx` | `Hero.tsx` | `HeroAboutSection` | `Hero` |
| `ProfileStatsSection.tsx` | `Stats.tsx` | `ProfileStatsSection` | `Stats` |
| `VisionMissionValuesSection.tsx` | `VisionMission.tsx` | `VisionMissionValuesSection` | `VisionMission` |
| `TimelineSection.tsx` | `Timeline.tsx` | `TimelineSection` | `Timeline` |
| `ServicesSection.tsx` | `Services.tsx` | `ServicesSection` | `Services` |
| `TeamAchievementsSection.tsx` | `Team.tsx` | `TeamAchievementsSection` | `Team` |
| `CTABannerAboutSection.tsx` | `CTA.tsx` | `CTABannerAboutSection` | `CTA` |

**Affected imports:**
- `app/(main)/about/page.tsx` — 7 imports

---

## 3. `components/sections/academy/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `AcademyHeroSection.tsx` | `Hero.tsx` | `AcademyHeroSection` | `Hero` |
| `AcademyStatsSection.tsx` | `Stats.tsx` | `AcademyStatsSection` | `Stats` |
| `AcademyFeaturesSection.tsx` | `Features.tsx` | `AcademyFeaturesSection` | `Features` |
| `AcademyModelSection.tsx` | `Model.tsx` | `AcademyModelSection` | `Model` |
| `AcademyCoursesSection.tsx` | `Courses.tsx` | `AcademyCoursesSection` | `Courses` |
| `AcademyInfoGridSection.tsx` | `InfoGrid.tsx` | `AcademyInfoGridSection` | `InfoGrid` |
| `AcademyMoreInfoGridSection.tsx` | `MoreInfoGrid.tsx` | `AcademyMoreInfoGridSection` | `MoreInfoGrid` |
| `CourseHero.tsx` | *(no change)* | | |
| `CourseSyllabus.tsx` | *(no change)* | | |
| `CourseInstructor.tsx` | *(no change)* | | |
| `CourseEnroll.tsx` | *(no change)* | | |
| `RelatedCourses.tsx` | *(no change)* | | |

**Affected imports:**
- `app/(main)/academy/page.tsx` — 7 imports

---

## 4. `components/sections/articles/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `ArticleHeroSection.tsx` | `Hero.tsx` | `ArticleHeroSection` | `Hero` |
| `ArticleStatsBarSection.tsx` | `StatsBar.tsx` | `ArticleStatsBarSection` | `StatsBar` |
| `ArticleCategoryBarSection.tsx` | `CategoryBar.tsx` | `ArticleCategoryBarSection` | `CategoryBar` |
| `ArticleLayoutSection.tsx` | `Layout.tsx` | `ArticleLayoutSection` | `Layout` |
| `ArticleNewsletterSection.tsx` | `Newsletter.tsx` | `ArticleNewsletterSection` | `Newsletter` |
| `ArticleHeader.tsx` | *(no change)* | | |
| `ArticleContent.tsx` | *(no change)* | | |
| `RelatedArticles.tsx` | *(no change)* | | |

**Affected imports:**
- `app/(main)/articles/page.tsx` — 5 imports
- `app/(main)/articles/[slug]/page.tsx` — 1 import (`ArticleNewsletterSection`)

---

## 5. `components/sections/contact/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `ContactHeroSection.tsx` | `Hero.tsx` | `ContactHeroSection` | `Hero` |
| `ContactMiddleSection.tsx` | `FormInfo.tsx` | `ContactMiddleSection` | `FormInfo` |
| `ContactLocationSection.tsx` | `Location.tsx` | `ContactLocationSection` | `Location` |

**Affected imports:**
- `app/(main)/contact/page.tsx` — 3 imports

---

## 6. `components/sections/distributors/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `DistributorHeroSection.tsx` | `Hero.tsx` | `DistributorHeroSection` | `Hero` |
| `DistributorStatsBarSection.tsx` | `StatsBar.tsx` | `DistributorStatsBarSection` | `StatsBar` |
| `DistributorBenefitsSection.tsx` | `Benefits.tsx` | `DistributorBenefitsSection` | `Benefits` |
| `DistributorProductCategorySection.tsx` | `ProductCategory.tsx` | `DistributorProductCategorySection` | `ProductCategory` |
| `DistributorInfoCardsSection.tsx` | `InfoCards.tsx` | `DistributorInfoCardsSection` | `InfoCards` |
| `DistributorSuccessSection.tsx` | `Success.tsx` | `DistributorSuccessSection` | `Success` |

**Affected imports:**
- `app/(main)/distributors/page.tsx` — 6 imports

---

## 7. `components/sections/investments/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `InvestmentHeroSection.tsx` | `Hero.tsx` | `InvestmentHeroSection` | `Hero` |
| `InvestmentStatsBarSection.tsx` | `StatsBar.tsx` | `InvestmentStatsBarSection` | `StatsBar` |
| `ProjectSection.tsx` | `Projects.tsx` | `ProjectSection` | `Projects` |
| `WhySection.tsx` | `Why.tsx` | `WhySection` | `Why` |
| `HowSection.tsx` | `How.tsx` | `HowSection` | `How` |
| `BottomLayoutSection.tsx` | `BottomLayout.tsx` | `BottomLayoutSection` | `BottomLayout` |
| `CtaSection.tsx` | `CTA.tsx` | `CtaSection` | `CTA` |
| `PortfolioSection.tsx` | `Portfolio.tsx` | `PortfolioSection` | `Portfolio` |
| `FaqSection.tsx` | `FAQ.tsx` | `FaqSection` | `FAQ` |
| `TestimonialSection.tsx` | `Testimonials.tsx` | `TestimonialSection` | `Testimonials` |
| `InvestmentCard.tsx` | *(no change)* | | |
| `InvestmentDetailHero.tsx` | *(no change)* | | |
| `InvestmentDetailTabs.tsx` | *(no change)* | | |
| `InvestmentForm.tsx` | *(no change)* | | |
| `RelatedInvestments.tsx` | *(no change)* | | |

**Affected imports:**
- `app/(main)/investments/page.tsx` — 7 imports (Hero, StatsBar, Project, Why, How, BottomLayout, Cta)
- `components/sections/investments/BottomLayoutSection.tsx` — internal imports (Portfolio, Testimonial, FAQ)

> [!NOTE]
> `InvestmentStatsBarSection.tsx` imports `StatItem` from `home/StatItem.tsx`. Path `home/StatItem` stays the same since StatItem is not renamed.

---

## 8. `components/sections/login/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `HeroLoginSection.tsx` | `Hero.tsx` | `HeroLoginSection` | `Hero` |
| `LoginSection.tsx` | `Login.tsx` | `LoginSection` | `Login` |
| `LoginForm.tsx` | `Form.tsx` | `LoginForm` | `LoginForm` *(named export, keep name)* |
| `LoginHeader.tsx` | `Header.tsx` | `LoginHeader` | `Header` |
| `LoginMembership.tsx` | `Membership.tsx` | `LoginMembership` | `Membership` |
| `LoginTrustBar.tsx` | `TrustBar.tsx` | `LoginTrustBar` | `TrustBar` |
| `ForgotPasswordSection.tsx` | `ForgotPassword.tsx` | `ForgotPasswordSection` | `ForgotPassword` |

**Affected imports:**
- `app/(main)/login/page.tsx` — 2 imports (Hero, LoginForm)
- `app/(main)/forgot-password/page.tsx` — 1 import (ForgotPassword)
- Internal: `LoginSection.tsx` imports `LoginHeader`, `LoginForm`, `LoginMembership`, `LoginTrustBar`

> [!IMPORTANT]
> `LoginForm` is a **named export** (not default). The file rename is `LoginForm.tsx` → `Form.tsx`, tapi export function name `LoginForm` tetap sama karena itu named export yang dipakai dengan `{ LoginForm }`.

---

## 9. `components/sections/logistics/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `LogisticHeroSection.tsx` | `Hero.tsx` | `LogisticHeroSection` | `Hero` |
| `LogisticStatsBarSection.tsx` | `StatsBar.tsx` | `LogisticStatsBarSection` | `StatsBar` |
| `LogisticServicesSection.tsx` | `Services.tsx` | `LogisticServicesSection` | `Services` |
| `CoverageAdvantagesSection.tsx` | `CoverageAdvantages.tsx` | `CoverageAdvantagesSection` | `CoverageAdvantages` |
| `ShippingFlowSection.tsx` | `ShippingFlow.tsx` | `ShippingFlowSection` | `ShippingFlow` |
| `TransportationPartnersSection.tsx` | `Partners.tsx` | `TransportationPartnersSection` | `Partners` |
| `CTABannerLogisticsSection.tsx` | `CTA.tsx` | `CTABannerLogisticsSection` | `CTA` |

**Affected imports:**
- `app/(main)/logistics/page.tsx` — 7 imports

---

## 10. `components/sections/marketplace/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `MarketplaceHeroSection.tsx` | `Hero.tsx` | `MarketplaceHeroSection` | `Hero` |
| `ProductTabsSection.tsx` | `ProductTabs.tsx` | `ProductTabsSection` | `ProductTabs` |
| `TrustBarSection.tsx` | `TrustBar.tsx` | `TrustBarSection` | `TrustBar` |
| `BestSellingProductSection.tsx` | `BestSelling.tsx` | `BestSellingProductSection` | `BestSelling` |
| `WhyMarketplaceSection.tsx` | `WhyMarketplace.tsx` | `WhyMarketplaceSection` | `WhyMarketplace` |
| `MarketplaceLayoutSection.tsx` | `Layout.tsx` | `MarketplaceLayoutSection` | `Layout` |
| `CategorySection.tsx` | `Categories.tsx` | `CategorySection` | `Categories` |
| `MitraBannerSection.tsx` | `MitraBanner.tsx` | `MitraBannerSection` | `MitraBanner` |
| `ProductCard.tsx` | *(no change)* | | |
| `ProductGallery.tsx` | *(no change)* | | |
| `ProductInfo.tsx` | *(no change)* | | |
| `ProductTabs.tsx` | *(no change)* | | |
| `RelatedProducts.tsx` | *(no change)* | | |
| `SidebarFilter.tsx` | *(no change)* | | |

> [!WARNING]
> **Conflict**: `ProductTabsSection.tsx` → `ProductTabs.tsx` akan bentrok dengan `ProductTabs.tsx` yang sudah ada (komponen detail page). 
> **Solusi**: Rename `ProductTabsSection.tsx` → `TabsFilter.tsx` (karena ini section filter tab di main marketplace page, bukan tab detail produk).

**Affected imports:**
- `app/(main)/marketplace/page.tsx` — 7 imports

---

## 11. `components/sections/register/`

| Old File | New File | Old Export | New Export |
|----------|----------|------------|------------|
| `SignupHeroSection.tsx` | `Hero.tsx` | `RegisterHeroSection` | `Hero` |
| `SignupFormSection.tsx` | `Form.tsx` | `RegisterFormSection` | `Form` |
| `SignupTrustBarSection.tsx` | `TrustBar.tsx` | `RegisterTrustBarSection` | `TrustBar` |

**Affected imports:**
- `app/(main)/register/page.tsx` — 3 imports

---

## Verification Plan

### Per-page build
Setelah setiap folder selesai di-rename + update import:
```bash
npm run build
```

### Final verification
Setelah semua selesai:
```bash
npm run build
```
Pastikan 0 errors.

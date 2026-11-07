<?php

namespace Tests\Feature;

use App\Models\PortalSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LogoSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_upload_logos_from_dashboard(): void
    {
        Storage::fake('public');

        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        $bbLogo = UploadedFile::fake()->image('bb-logo.png');
        $sicipLogo = UploadedFile::fake()->image('sicip-logo.png');

        $response = $this->actingAs($admin)
            ->post('/admin/settings/logos', [
                'bb_logo' => $bbLogo,
                'sicip_logo' => $sicipLogo,
            ]);

        $response->assertSessionHas('success');

        $savedBbLogo = PortalSetting::get('bb_logo');
        $savedSicipLogo = PortalSetting::get('sicip_logo');

        $this->assertNotNull($savedBbLogo);
        $this->assertNotNull($savedSicipLogo);
        $this->assertStringContainsString('/uploads/logos/', $savedBbLogo);
        $this->assertStringContainsString('/uploads/logos/', $savedSicipLogo);
    }

    public function test_admin_can_reset_logos_to_default(): void
    {
        PortalSetting::set('bb_logo', '/storage/logos/sample.png');

        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)
            ->post('/admin/settings/logos', [
                'reset_bb_logo' => true,
            ]);

        $response->assertSessionHas('success');
        $this->assertNull(PortalSetting::get('bb_logo'));
    }
}

